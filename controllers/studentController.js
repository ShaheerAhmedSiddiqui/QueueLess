const bcrypt = require('bcrypt');
const User = require('../models/User');
const Service = require('../models/Service');
const queueService = require('../services/queueService');
const QueueToken = require('../models/QueueToken');

const services = [
    { id: 1, name: 'Student Affairs', icon: 'bi-people', description: 'Academic records, enrollment letters and general student support.', queue: 4, wait: 12, available: true },
    { id: 2, name: 'Fee Office', icon: 'bi-wallet2', description: 'Fee statements, challans and account-related assistance.', queue: 7, wait: 21, available: true },
    { id: 3, name: 'Admissions Office', icon: 'bi-mortarboard', description: 'Admission guidance, application status and enrollment queries.', queue: 2, wait: 6, available: true },
    { id: 4, name: 'Examination Office', icon: 'bi-journal-check', description: 'Exam forms, transcripts, results and examination records.', queue: 8, wait: 24, available: true },
    { id: 5, name: 'IT Support', icon: 'bi-pc-display', description: 'Help with student portals, accounts and campus technology.', queue: 0, wait: null, available: false },
    { id: 6, name: 'Document Verification', icon: 'bi-file-earmark-check', description: 'Verification requests for academic and university documents.', queue: 3, wait: 9, available: true }
];

const activeQueue = {
    id: 42,
    token: 'EX-042',
    service: 'Examination Office',
    counter: 'Counter 02',
    status: 'Waiting',
    position: 3,
    ahead: 2,
    currentToken: 'EX-039',
    wait: 10,
    joined: 'Today, 10:24 AM',
    progress: 42
};

const history = [
    { token: 'SA-018', service: 'Student Affairs', date: 'Oct 28, 2026', time: '11:42 AM', status: 'Completed', duration: '8 min' },
    { token: 'FO-031', service: 'Fee Office', date: 'Oct 19, 2026', time: '09:15 AM', status: 'Completed', duration: '12 min' },
    { token: 'IT-009', service: 'IT Support', date: 'Oct 12, 2026', time: '02:05 PM', status: 'Cancelled', duration: '—' },
    { token: 'EX-026', service: 'Examination Office', date: 'Sep 30, 2026', time: '10:30 AM', status: 'Completed', duration: '6 min' }
];

// Reusable rendering helper
function render(req, res, view, title, activePage, extra = {}) {

    const demoMode = Boolean(
        res.locals.demoMode || req.session?.demoStudent
    );

    let student;

    if (demoMode) {
        student = {
            fullName: 'Ahmed Khan',
            email: 'ahmed.khan@university.edu',
            studentId: 'SU-2023-1042',
            role: 'Student'
        };
    } else {
        const user = req.session?.user || {};

        student = {
            fullName: user.fullName || user.name || 'Student',
            email: user.email || '',
            studentId: user.studentId || '—',
            role: 'Student'
        };
    }

    return res.render(view, {
        title,
        activePage,
        student,
        services,
        activeQueue,
        history,
        demoMode,
        pageCss: extra.pageCss,
        pageScript: extra.pageScript,
        ...extra.data
    });
}

// Student Dashboard
const dashboard = async (req, res, next) => {
    try {
        const studentId = req.session?.user?.id;

        if (!studentId) {
            return res.status(401).send('Please log in first.');
        }

        const [activeQueues, history, dbServices] = await Promise.all([
            queueService.getMyQueues(studentId),
            queueService.getMyHistory(studentId),
            Service.getAllServices()
        ]);

        return render(
            req,
            res,
            'student/dashboard',
            'Dashboard',
            'dashboard',
            {
                data: {
                    activeQueues,
                    history,
                    services: dbServices
                }
            }
        );
    } catch (err) {
        next(err);
    }
};
// Student Profile
const profile = (req, res) => {
    return render(req, res, 'student/profile', 'My Profile', 'profile', {
        data: {
            queryStatus: req.query.status
        }
    });
};


const updateProfile = async (req, res, next) => {
    try {
        if (req.session.demoStudent) {
            return res.status(403).send('Profile updates are unavailable in demo preview.');
        }

        const userId = req.session.user?.id;
        if (!userId) {
            return res.status(401).send('Please log in first.');
        }

        const fullName = String(req.body.fullName || '').trim();

        if (!fullName) {
            return res.status(400).send('Full name is required.');
        }

        if (fullName.length > 120) {
            return res.status(400).send('Full name cannot exceed 120 characters.');
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).send('Account not found.');
        }

        await User.updateProfile(userId, fullName);

        req.session.user.fullName = fullName;
        req.session.user.name = fullName;

        return res.redirect('/student/profile?status=profile-updated');
    } catch (err) {
        next(err);
    }
};

const changePassword = async (req, res, next) => {
    try {
        if (req.session.demoStudent) {
            return res.status(403).send('Password changes are unavailable in demo preview.');
        }

        const userId = req.session.user?.id;
        if (!userId) {
            return res.status(401).send('Please log in first.');
        }

        const currentPassword = String(req.body.currentPassword || '');
        const newPassword = String(req.body.newPassword || '');
        const confirmPassword = String(req.body.confirmNewPassword || '');

        if (!currentPassword || !newPassword || !confirmPassword) {
            return res.status(400).send('All password fields are required.');
        }

        if (newPassword.length < 8) {
            return res.status(400).send('New password must be at least 8 characters.');
        }

        if (newPassword !== confirmPassword) {
            return res.status(400).send('New passwords do not match.');
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).send('Account not found.');
        }

        const isCurrentPasswordValid = await bcrypt.compare(
            currentPassword,
            user.password_hash
        );

        if (!isCurrentPasswordValid) {
            return res.status(400).send('Current password is incorrect.');
        }

        if (await bcrypt.compare(newPassword, user.password_hash)) {
            return res.status(400).send('New password must be different from the current password.');
        }

        const passwordHash = await bcrypt.hash(newPassword, 10);
        await User.updatePassword(userId, passwordHash);

        return res.redirect('/student/profile?status=password-updated');
    } catch (err) {
        next(err);
    }
};


// My Queues
const myQueues = async (req, res, next) => {
    try {
        const studentId = req.session?.user?.id;

        if (!studentId) {
            return res.status(401).send('Please log in first.');
        }

        const [activeQueues, history] = await Promise.all([
            queueService.getMyQueues(studentId),
            queueService.getMyHistory(studentId)
        ]);
        return render(
            req,
            res,
            'student/my-queues',
            'My Queues',
            'my-queues',
            {
                data: {
                    activeQueues,
                    history
                }
            }
        );
    } catch (err) {
        next(err);
    }
};
// Available Services
const service = async (req, res, next) => {
    try {
        const dbServices = await Service.getAllServices();

        return render(
            req,
            res,
            'student/services',
            'Available Services',
            'services',
            {
                data: {
                services: dbServices,
                queryStatus: req.query.status
            }
            }
        );
    } catch (err) {
        next(err);
    }
};

// Queue Status

const queueStatus = async (req, res, next) => {
    try {
        const studentId = req.session?.user?.id;
        const tokenNumber = req.query.token;

        if (!studentId) {
            return res.status(401).send('Please log in first.');
        }

        if (!tokenNumber) {
            return res.status(400).send('Queue token is required.');
        }

        const token = await QueueToken.getTokenByNumber(
            tokenNumber,
            studentId
        );

        if (!token) {
            return res.status(404).send('Queue token not found.');
        }

        const position = await QueueToken.getQueuePosition(
            token.id,
            studentId
        );

        if (!position) {
            return res.status(404).send('Queue position not found.');
        }

        const service = await Service.getServiceById(token.service_id);

        const activeQueueData = {
            id: token.id,
            token: token.token_number,
            status: position.status,
            position: position.position,
            ahead: position.ahead,
            serviceName: service ? service.name : 'Unknown service',
            joinedAt: token.joined_at
        };

        return render(
            req,
            res,
            'student/queue-status',
            'Queue Status',
            'queue-status',
            {
                data: {
                    activeQueue: activeQueueData
                }
            }
        );

    } catch (err) {
        next(err);
    }
};


// Queue History
const stdhistory = async (req, res, next) => {
    try {
        const studentId = req.session?.user?.id;

        if (!studentId) {
            return res.status(401).send('Please log in first.');
        }

        const history = await queueService.getMyHistory(studentId);

        return render(
            req,
            res,
            'student/history',
            'History',
            'history',
            {
                data: {
                    history
                }
            }
        );
    } catch (err) {
        next(err);
    }
};

//Join Queue
const joinQueue = async (req, res, next) => {
    try {
        // Get the logged-in user's database ID
        const studentId = req.session?.user?.id;

        // Preview mode does not have a real database user
        if (!studentId) {
            return res.status(401).send(
                'Please log in with a student account to join a queue.'
            );
        }

        const rawServiceId = String(req.body.serviceId || '').trim();
        const serviceId = Number(rawServiceId.replace(/^["']|["']$/g, ''));

        if (!Number.isInteger(serviceId) || serviceId <= 0) {
            return res.status(400).send('Invalid service selected.');
        }

        const result = await queueService.joinQueue(studentId, serviceId);

        return res.redirect(
            `/student/queue-status?token=${encodeURIComponent(result.token)}`
        );
    } catch (err) {
        if (err.message === 'You already have an active token for this service') {
            return res.redirect('/student/services?status=already-joined');
        }

        next(err);
    }
};

module.exports = {
    dashboard,
    profile,
    myQueues,
    service,
    queueStatus,
    stdhistory,
    joinQueue,
    updateProfile,
    changePassword,
}


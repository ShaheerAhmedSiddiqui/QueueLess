const services = [
  { id: 1, name: 'Student Affairs', icon: 'bi-people', description: 'Academic records, enrollment letters and general student support.', queue: 4, wait: 12, available: true },
  { id: 2, name: 'Fee Office', icon: 'bi-wallet2', description: 'Fee statements, challans and account-related assistance.', queue: 7, wait: 21, available: true },
  { id: 3, name: 'Admissions Office', icon: 'bi-mortarboard', description: 'Admission guidance, application status and enrollment queries.', queue: 2, wait: 6, available: true },
  { id: 4, name: 'Examination Office', icon: 'bi-journal-check', description: 'Exam forms, transcripts, results and examination records.', queue: 8, wait: 24, available: true },
  { id: 5, name: 'IT Support', icon: 'bi-pc-display', description: 'Help with student portals, accounts and campus technology.', queue: 0, wait: null, available: false },
  { id: 6, name: 'Document Verification', icon: 'bi-file-earmark-check', description: 'Verification requests for academic and university documents.', queue: 3, wait: 9, available: true }
];

const activeQueue = { id: 42, token: 'EX-042', service: 'Examination Office', counter: 'Counter 02', status: 'Waiting', position: 3, ahead: 2, currentToken: 'EX-039', wait: 10, joined: 'Today, 10:24 AM', progress: 42 };
const history = [
  { token: 'SA-018', service: 'Student Affairs', date: 'Oct 28, 2026', time: '11:42 AM', status: 'Completed', duration: '8 min' },
  { token: 'FO-031', service: 'Fee Office', date: 'Oct 19, 2026', time: '09:15 AM', status: 'Completed', duration: '12 min' },
  { token: 'IT-009', service: 'IT Support', date: 'Oct 12, 2026', time: '02:05 PM', status: 'Cancelled', duration: '—' },
  { token: 'EX-026', service: 'Examination Office', date: 'Sep 30, 2026', time: '10:30 AM', status: 'Completed', duration: '6 min' }
];

function render(res, view, title, activePage, extra = {}) {
  const student = res.locals.demoMode || res.req.session?.demoStudent
    ? { fullName: 'Ahmed Khan', email: 'ahmed.khan@university.edu', studentId: 'SU-2023-1042', role: 'Student' }
    : { fullName: res.req.session.user.fullName || res.req.session.user.name || 'Student', email: res.req.session.user.email, studentId: res.req.session.user.studentId || '—', role: 'Student' };
  return res.render(view, { title, activePage, student, services, activeQueue, history, pageCss: extra.pageCss, pageScript: extra.pageScript, ...extra.data });
}


const dashboard = (req, res) => {
    return res.render(res, 'student/dashboard', 'Dashboard', 'dashboard');
}

const profile = (req, res) => {
    return res.render(res, 'student/profile', 'Profile', 'profile');
}
const myQueues = (req, res) => {
    return res.render(res, 'student/my-queues', 'MyQueues', 'myQueues');
}
const service = (req, res) => {
    return res.render(res, 'student/services', 'Services', 'services');
}
const queueStatus = (req, res) => {
    return res.render(res, 'student/queue-status', 'QueueStatus', 'queue-status');
}
const stdhistory = (req, res) => {
    return res.render(res, 'student/history', 'History', 'history');
}
module.exports = {
    dashboard,
    profile,
    myQueues,
    service,
    queueStatus,
    stdhistory
}


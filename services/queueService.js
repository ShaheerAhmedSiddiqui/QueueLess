
const Service = require('../models/Service');
const QueueToken = require('../models/QueueToken');

// Join a service queue
async function joinQueue(studentId, serviceId) {

    if (!studentId || !serviceId) {
        throw new Error('Student ID and Service ID are required');
    }

    const service = await Service.getServiceById(serviceId);

    if (!service) {
        throw new Error('Service not found');
    }

    if (!service.is_active) {
        throw new Error('This service is currently unavailable');
    }

    const token = await QueueToken.createToken(
        studentId,
        serviceId
    );

    return {
        id: token.id,
        token: token.token,
        service: service.name,
        status: 'WAITING'
    };
}

// Get student's active queues
async function getMyQueues(studentId) {
    return QueueToken.getActiveQueues(studentId);
}

// Get student's queue history
async function getMyHistory(studentId) {
    return QueueToken.getQueueHistory(studentId);
}

// Get a particular token's status
async function getTokenStatus(tokenId, studentId) {

    const status = await QueueToken.getQueuePosition(
        tokenId,
        studentId
    );

    if (!status) {
        throw new Error('Queue token not found');
    }

    return status;
}

// Cancel a queue token
async function cancelQueue(tokenId, studentId) {

    const cancelled = await QueueToken.cancelToken(
        tokenId,
        studentId
    );

    if (!cancelled) {
        throw new Error(
            'Token could not be cancelled. It may already be called or completed.'
        );
    }

    return {
        message: 'Queue cancelled successfully'
    };
}

module.exports = {
    joinQueue,
    getMyQueues,
    getMyHistory,
    getTokenStatus,
    cancelQueue
};

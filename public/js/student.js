
document.addEventListener('DOMContentLoaded', () => {
    const joinButtons = document.querySelectorAll('[data-join-service]');
    const modalElement = document.getElementById('joinQueueModal');
    const serviceNameElement = document.getElementById('selectedServiceName');
    const serviceIdInput = document.getElementById('selectedServiceId');

    if (!modalElement || !serviceNameElement || !serviceIdInput) {
        console.error('Join Queue modal elements not found.');
        return;
    }

    joinButtons.forEach((button) => {
        button.addEventListener('click', () => {
            const serviceName = button.dataset.serviceName;
            const serviceId = button.dataset.joinService;
            console.log('Selected service ID:', serviceId);

            serviceNameElement.textContent = serviceName;
            serviceIdInput.value = serviceId;

            const modal = bootstrap.Modal.getOrCreateInstance(modalElement);
            modal.show();
        });
    });
});

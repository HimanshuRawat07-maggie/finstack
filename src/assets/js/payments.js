function initPayment(key, env) {
    var easebuzzCheckout = new EasebuzzCheckout(key, env);
    var options = {
        access_key: key,
        onResponse: (response) => {
            var event = new CustomEvent('paymentResponse', { detail: response });
            window.dispatchEvent(event);
        },
        theme: "#7539FF"
    }
    easebuzzCheckout.initiatePayment(options);
}
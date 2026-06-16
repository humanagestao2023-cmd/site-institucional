document.addEventListener('DOMContentLoaded', function () {
    var menuLinks = document.querySelectorAll('.nav-menu a');
    var headerHeight = document.querySelector('header').offsetHeight || 0;
    var navHeight = document.querySelector('.nav-menu').offsetHeight || 0;

    // Constantes de contato e redes sociais (configure aqui)
    var WHATSAPP_NUMBER = '5511999999999';
    var WHATSAPP_URL = 'https://wa.me/' + WHATSAPP_NUMBER;
    var INSTAGRAM_URL = 'https://www.instagram.com/clinicahumana';
    var FACEBOOK_URL = 'https://www.facebook.com/clinicahumana';

    var whatsappFloatLink = document.getElementById('whatsapp-float-link');
    var whatsappFooterLink = document.getElementById('whatsapp-footer-link');
    var whatsappCtaLink = document.getElementById('whatsapp-cta-link');
    var instagramLink = document.getElementById('instagram-link');
    var facebookLink = document.getElementById('facebook-link');

    if (whatsappFloatLink) whatsappFloatLink.href = WHATSAPP_URL;
    if (whatsappFooterLink) whatsappFooterLink.href = WHATSAPP_URL;
    if (whatsappCtaLink) whatsappCtaLink.href = WHATSAPP_URL;
    if (instagramLink) instagramLink.href = INSTAGRAM_URL;
    if (facebookLink) facebookLink.href = FACEBOOK_URL;

    var whatsappNumberElems = document.querySelectorAll('#whatsapp-number, #whatsapp-number-info');
    whatsappNumberElems.forEach(function (el) {
        el.textContent = '(11) ' + WHATSAPP_NUMBER.slice(-8, -4) + '-' + WHATSAPP_NUMBER.slice(-4);
    });

    function getOffsetTop(element) {
        var rect = element.getBoundingClientRect();
        return rect.top + window.pageYOffset;
    }

    menuLinks.forEach(function (link) {
        link.addEventListener('click', function (event) {
            event.preventDefault();
            var targetId = this.getAttribute('href').substring(1);
            var targetElement = document.getElementById(targetId);
            if (!targetElement) return;

            var offsetPadding = headerHeight + navHeight + 12;
            var scrollTo = getOffsetTop(targetElement) - offsetPadding;

            window.scrollTo({ top: scrollTo, behavior: 'smooth' });

            menuLinks.forEach(function (item) {
                item.classList.remove('active');
            });
            this.classList.add('active');
        });
    });

    function updateActiveSection() {
        var currentPosition = window.pageYOffset + headerHeight + navHeight + 24;

        menuLinks.forEach(function (link) {
            var targetId = link.getAttribute('href').substring(1);
            var targetElement = document.getElementById(targetId);
            if (!targetElement) return;

            var top = getOffsetTop(targetElement);
            var bottom = top + targetElement.offsetHeight;

            if (currentPosition >= top && currentPosition < bottom) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    function throttle(func, limit) {
        var inThrottle;
        return function() {
            var args = arguments;
            var context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(function() {
                    inThrottle = false;
                }, limit);
            }
        };
    }

    var lastScrollY = window.pageYOffset;
    var ctaBar = document.querySelector('.fixed-contact-cta');

    window.addEventListener('scroll', throttle(function () {
        var currentScrollY = window.pageYOffset;
        if (!ctaBar) return;

        if (currentScrollY > lastScrollY && currentScrollY > 100) {
            ctaBar.classList.add('hidden-cta');
        } else {
            ctaBar.classList.remove('hidden-cta');
        }

        lastScrollY = currentScrollY;
    }, 100));

    window.addEventListener('scroll', throttle(updateActiveSection, 100));
    updateActiveSection();

    var agendamentoForm = document.getElementById('form-agendamento');
    var CONTACT_EMAIL_RECEIVER = 'seu-email@dominio.com'; // Atualize aqui com e-mail real de recebimento

    if (agendamentoForm) {
        agendamentoForm.addEventListener('submit', function (event) {
            var isGoogleFormConfigured = !agendamentoForm.action.includes('YOUR_GOOGLE_FORM_ID_HERE');

            var modal = document.getElementById('submission-modal');
            var modalClose = document.getElementById('modal-close');

            if (!isGoogleFormConfigured) {
                event.preventDefault();
                showMessage('Formulário do Google Forms não configurado. Atualize `YOUR_GOOGLE_FORM_ID_HERE` no atributo action do form.');
                return;
            }

            // Envio de email via mailto (sem backend)
            if (CONTACT_EMAIL_RECEIVER && CONTACT_EMAIL_RECEIVER.indexOf('@') > -1) {
                var nome = document.getElementById('nome').value;
                var paciente = document.getElementById('nome-paciente').value;
                var relacao = document.getElementById('relacao').value;
                var telefone = document.getElementById('telefone').value;
                var mensagem = document.getElementById('mensagem').value;

                var body = 'Novo agendamento de avaliação:\n';
                body += 'Nome do familiar/cuidador: ' + nome + '\n';
                body += 'Nome do paciente: ' + paciente + '\n';
                body += 'Relação com o paciente: ' + relacao + '\n';
                body += 'Telefone/WhatsApp: ' + telefone + '\n';
                body += 'Resumo da situação: ' + mensagem + '\n';

                var mailtoLink = 'mailto:' + encodeURIComponent(CONTACT_EMAIL_RECEIVER)
                    + '?subject=' + encodeURIComponent('Novo agendamento - Clínica Reabilitação Humana')
                    + '&body=' + encodeURIComponent(body);

                window.open(mailtoLink, '_blank');
            }

            // Para Google Forms, permitirá envio padrão (abre em nova aba via target="_blank")
            setTimeout(function() {
                showMessage('Pedido de agendamento enviado. Obrigado!');
                agendamentoForm.reset();
            }, 500);

            function showMessage(message) {
                if (modal) {
                    modal.querySelector('#modal-message').textContent = message;
                    modal.classList.remove('hidden');
                    document.body.classList.add('modal-open');
                }
            }

            if (modalClose) {
                modalClose.addEventListener('click', function () {
                    modal.classList.add('hidden');
                    document.body.classList.remove('modal-open');
                });
            }

            if (modal) {
                modal.addEventListener('click', function (e) {
                    if (e.target === modal) {
                        modal.classList.add('hidden');
                        document.body.classList.remove('modal-open');
                    }
                });
            }
        });
    }

});
import dramatiq
from django.core.mail import send_mail
from django.template.loader import render_to_string


@dramatiq.actor
def send_verification_code(email, code):
    html_content = render_to_string('emails/verification.html', {'code': code})

    send_mail(
        subject='Verification Code',
        message='',
        html_message=html_content,
        from_email='no-reply@localhost',
        recipient_list=[email],
    )

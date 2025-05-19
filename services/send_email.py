import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class EmailSender:
    def __init__(self):
        self.SMTP_SERVER = 'smtp.gmail.com'
        self.SMTP_PORT = 587
        self.email_user = os.getenv('EMAIL_USER', '')
        self.email_password = os.getenv('EMAIL_PASSWORD', '')
        self.receiver_email = 'namanjha2014@gmail.com'  # Hardcoded as specified
        self.is_configured = bool(self.email_user and self.email_password)
        print(f"EMAIL_USER: {self.email_user}, EMAIL_PASSWORD: {'set' if self.email_password else 'not set'}")

    def send_mail(self, recipient_email, subject, body):
        if not self.is_configured:
            print("⚠️ Email not configured, skipping email send")
            return False
            
        try:
            msg = MIMEMultipart()
            msg['From'] = self.email_user
            msg['To'] = recipient_email
            msg['Subject'] = subject
            msg.attach(MIMEText(body, 'plain'))
            with smtplib.SMTP(self.SMTP_SERVER, self.SMTP_PORT) as server:
                server.starttls()
                server.login(self.email_user, self.email_password)
                server.sendmail(self.email_user, recipient_email, msg.as_string())
                print(f"✅ Email sent successfully to {recipient_email}")
            return True
        except Exception as e:
            print(f"❌ Error sending email: {e}")
            return False
            
    def send_contact_email(self, name, email, subject, message):
        """
        Send contact form data to the receiver email.
        """
        email_subject = f"Portfolio Contact: {subject}"
        email_body = f"""
Name: {name}
Email: {email}
Subject: {subject}
Message: {message}
        """
        return self.send_mail(self.receiver_email, email_subject, email_body)

    def __post_init__(self):
        print(f"EMAIL_USER: {self.email_user}, EMAIL_PASSWORD: {'set' if self.email_password else 'not set'}")

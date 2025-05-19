from flask import Flask, render_template, request, flash, redirect, url_for, session
from services.send_email import EmailSender
import os

app = Flask(__name__)
app.secret_key = '5581c6f3343f1550d4cc9bdd9b27838d'  # Required for flash messages

# Initialize Email Sender
email_sender = EmailSender()

# Social media links configuration
social_links = {
    'github': 'https://github.com/namanshankar',
    'linkedin': 'https://linkedin.com/in/namanshankar',
    'instagram': 'https://instagram.com/namanshankar',
    'facebook': 'https://facebook.com/namanshankar'
}

# Create a context processor to make social_links available to all templates
@app.context_processor
def inject_social_links():
    return dict(social_links=social_links)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/about')
def about():
    return render_template('about.html')

@app.route('/projects')
def projects():
    return render_template('projects.html')

@app.route('/articles')
def articles():
    return render_template('articles.html')

@app.route('/contact', methods=['GET', 'POST'])
def contact():
    if request.method == 'POST':
        name = request.form.get('name')
        email = request.form.get('email')
        subject = request.form.get('subject')
        message = request.form.get('message')
        
        # Send the contact form submission via email
        sent = email_sender.send_contact_email(name, email, subject, message)
        
        if sent:
            flash('Thank you for your message! I will get back to you soon.', 'success')
        else:
            flash('There was an issue sending your message. Please try again or contact directly.', 'error')
        
        # Redirect to avoid form resubmission
        return redirect(url_for('contact'))
        
    return render_template('contact.html')

# Individual project routes
@app.route('/projects/pavement-distress')
def project_pavement():
    return render_template('project_pavement.html')

@app.route('/projects/whats-in-picture')
def project_picture():
    return render_template('project_picture.html')

@app.route('/projects/question-clustering')
def project_clustering():
    return render_template('project_clustering.html')

@app.route('/projects/game-mechanics')
def project_game():
    return render_template('project_game.html')

@app.route('/projects/newsletter-management')
def project_newsletter():
    return render_template('project_newsletter.html')

@app.route('/projects/medical-image-analysis')
def project_medical():
    return render_template('project_medical.html')

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 10000))
    app.run(host='0.0.0.0', port=port, debug=False) 
# Generated manually

from django.db import migrations, models
import django.core.validators
import books.models

class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Book',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=255)),
                ('author', models.CharField(blank=True, max_length=255)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('source_language', models.CharField(default='en', max_length=50)),
                ('target_language', models.CharField(max_length=50)),
                ('file', models.FileField(blank=True, help_text='Supported formats: PDF, EPUB, TXT, DOCX, HTML, MD (max 50MB)', null=True, upload_to='books/', validators=[django.core.validators.FileExtensionValidator(allowed_extensions=['pdf', 'epub', 'txt', 'docx', 'html', 'md']), books.models.validate_book_file])),
                ('url', models.URLField(blank=True, max_length=500, null=True)),
                ('file_format', models.CharField(blank=True, choices=[('pdf', 'PDF'), ('epub', 'EPUB'), ('txt', 'Plain Text'), ('docx', 'Word Document'), ('html', 'HTML'), ('md', 'Markdown')], max_length=10, null=True)),
            ],
        ),
    ]
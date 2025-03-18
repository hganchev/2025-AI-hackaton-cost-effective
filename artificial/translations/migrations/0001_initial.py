# Generated manually

from django.db import migrations, models
import django.db.models.deletion

class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('books', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Translation',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('status', models.CharField(choices=[('pending', 'Pending'), ('processing', 'Processing'), ('completed', 'Completed'), ('failed', 'Failed')], default='pending', max_length=20)),
                ('translated_file', models.FileField(blank=True, null=True, upload_to='translations/')),
                ('error_message', models.TextField(blank=True)),
                ('total_chunks', models.IntegerField(default=0)),
                ('completed_chunks', models.IntegerField(default=0)),
                ('book', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='translations', to='books.book')),
            ],
        ),
        migrations.CreateModel(
            name='TranslationChunk',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('chunk_index', models.IntegerField(help_text='The index of this chunk in the translation sequence')),
                ('original_text', models.TextField(help_text='The original text of this chunk before translation')),
                ('translated_text', models.TextField(blank=True, help_text='The translated text of this chunk', null=True)),
                ('status', models.CharField(choices=[('pending', 'Pending'), ('processing', 'Processing'), ('completed', 'Completed'), ('failed', 'Failed')], default='pending', max_length=20)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('error_message', models.TextField(blank=True)),
                ('translation', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='chunks', to='translations.translation')),
            ],
            options={
                'ordering': ['chunk_index'],
                'unique_together': {('translation', 'chunk_index')},
            },
        ),
    ]
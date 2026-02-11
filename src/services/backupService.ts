import { exportLessonToPDF, exportAnnualPlanToPDF, exportSequenceToPDF, exportAssessmentToPDF } from './exportService';
import { jsPDF } from 'jspdf';

// Generic type for content that can be backed up
type BackupContent = {
    type: 'lesson' | 'annual' | 'sequence' | 'assessment' | 'report';
    data: any;
    filename: string;
};

export const performSafetyBackup = async (content: BackupContent) => {
    try {
        console.log('Initiating safety backup for:', content.filename);
        const doc = new jsPDF();

        // Generate PDF Blob based on type
        switch (content.type) {
            case 'lesson':
                exportLessonToPDF(content.data, doc);
                break;
            case 'annual':
                exportAnnualPlanToPDF(content.data, doc);
                break;
            case 'sequence':
                exportSequenceToPDF(content.data, doc);
                break;
            case 'assessment':
                exportAssessmentToPDF(content.data, doc);
                break;
            default:
                console.warn('Backup not supported for this type yet');
                return;
        }

        // 1. Force Local Download (The "Safety Net")
        // The export functions in exportService currently call .save() internally if no doc is passed,
        // bu we passed a doc, so we must save it here to ensure we define the filename.
        // Actually, looking at exportService, if doc IS passed, it just adds to it and returns y.
        // So we need to call save here.

        doc.save(`BACKUP_${content.filename}.pdf`);
        console.log('Local backup saved successfully.');

        // 2. Email Attempt (Mailto fallback since no backend)
        // We cannot attach files via mailto. 
        // We will notify the user that a local copy was saved.

        // Future Integration:
        // if (emailServiceConfigured) { await sendEmailWithAttachment(blob); }

    } catch (error) {
        console.error('Safety backup failed:', error);
        alert('AVISO: Falha ao criar backup automático. Por favor, exporte manualmente seu trabalho.');
    }
};

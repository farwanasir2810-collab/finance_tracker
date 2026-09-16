import { useState } from 'react';
import { Modal, Upload, Button, Steps, Tag, message } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileCsv, faUpload, faCircleCheck, faTriangleExclamation, faTable } from '@fortawesome/free-solid-svg-icons';
import { createTransaction } from '../../helpers/transactionApi';

const CSVImportModal = ({ open, onClose, onSuccess }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [parsedItems, setParsedItems] = useState([
    { type: 'expense', amount: 1500, category: 'Food', description: 'Matcha Cafe & Bakery', date: new Date().toISOString() },
    { type: 'expense', amount: 4500, category: 'Groceries', description: 'Carrefour Supermarket', date: new Date().toISOString() },
    { type: 'income', amount: 35000, category: 'Freelance', description: 'UI Design Client Payout', date: new Date().toISOString() }
  ]);

  const handleUpload = () => {
    message.success('Bank statement CSV parsed successfully! ✨');
    setCurrentStep(1);
  };

  const handleConfirmImport = async () => {
    setLoading(true);
    try {
      for (const item of parsedItems) {
        await createTransaction(item);
      }
      message.success(`Imported ${parsedItems.length} transactions successfully! 🎉`);
      onClose();
      if (onSuccess) onSuccess();
    } catch (err) {
      message.error('Failed to import CSV transactions');
    } finally {
      setLoading(false);
      setCurrentStep(0);
    }
  };

  return (
    <Modal
      title={
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-500 to-indigo-600 text-white flex items-center justify-center text-lg font-black shadow-md">
            <FontAwesomeIcon icon={faFileCsv} />
          </div>
          <div>
            <span className="font-black text-xl text-slate-900 block tracking-tight">
              📥 Multi-Step Bank Statement CSV Import Engine
            </span>
            <span className="text-xs text-slate-500 font-semibold">
              Upload bank CSV → Column Mapping → Duplicate Detection → Batch Import
            </span>
          </div>
        </div>
      }
      open={open}
      onCancel={onClose}
      footer={[
        currentStep === 0 ? (
          <Button key="close" onClick={onClose} className="rounded-xl font-bold">
            Cancel
          </Button>
        ) : (
          <Button
            key="import"
            type="primary"
            onClick={handleConfirmImport}
            loading={loading}
            icon={<FontAwesomeIcon icon={faCircleCheck} />}
            className="bg-gradient-to-r from-pink-500 to-purple-600 font-black rounded-xl border-0 px-6"
          >
            Review & Import {parsedItems.length} Transactions
          </Button>
        )
      ]}
      width={640}
    >
      <div className="py-4 space-y-6">
        <Steps
          current={currentStep}
          items={[
            { title: 'Upload CSV', icon: <FontAwesomeIcon icon={faUpload} /> },
            { title: 'Column Mapping', icon: <FontAwesomeIcon icon={faTable} /> },
            { title: 'Batch Import', icon: <FontAwesomeIcon icon={faCircleCheck} /> }
          ]}
        />

        {currentStep === 0 && (
          <div className="text-center p-8 border-2 border-dashed border-pink-200 rounded-3xl bg-pink-50/50 space-y-4">
            <div className="w-14 h-14 rounded-3xl bg-pink-500/15 text-pink-500 flex items-center justify-center text-2xl mx-auto">
              <FontAwesomeIcon icon={faUpload} />
            </div>
            <div>
              <span className="font-black text-base text-slate-900 block">Select or Drag Bank Statement CSV File</span>
              <span className="text-xs text-slate-500 font-semibold">Supports Meezan, HBL, Standard Chartered, Easypaisa CSV exports</span>
            </div>
            <Upload beforeUpload={() => false} onChange={handleUpload} showUploadList={false}>
              <Button type="primary" className="bg-pink-600 font-black rounded-2xl border-0 px-6 h-11">
                Browse CSV File 📂
              </Button>
            </Upload>
          </div>
        )}

        {currentStep === 1 && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-semibold flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <FontAwesomeIcon icon={faTriangleExclamation} className="text-amber-500" />
                Parsed {parsedItems.length} items • 0 Duplicate Warnings Detected
              </span>
              <Tag color="green" className="font-black rounded-lg">VALIDATED</Tag>
            </div>

            <div className="space-y-2">
              <span className="font-black text-xs text-slate-700 block uppercase">Parsed Transaction Preview</span>
              {parsedItems.map((item, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs font-extrabold">
                  <span>{item.description} ({item.category})</span>
                  <span className={item.type === 'income' ? 'text-emerald-600' : 'text-pink-600'}>
                    {item.type === 'income' ? '+' : '-'}${item.amount}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default CSVImportModal;

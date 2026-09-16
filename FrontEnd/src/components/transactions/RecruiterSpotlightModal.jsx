import { Modal, Tag, Button } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faStar,
  faCode,
  faServer,
  faLayerGroup,
  faShieldHalved,
  faBolt,
  faBrain,
  faChartPie,
  faCheckCircle2
} from '@fortawesome/free-solid-svg-icons';

const RecruiterSpotlightModal = ({ open, onClose }) => {
  return (
    <Modal
      title={
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-purple-600 text-white flex items-center justify-center text-lg font-black shadow-lg shadow-amber-500/20">
            <FontAwesomeIcon icon={faStar} />
          </div>
          <div>
            <span className="font-black text-xl text-white block tracking-tight">
              Recruiter & Technical Architecture Spotlight
            </span>
            <span className="text-xs text-purple-300/70 font-semibold">
              Production-grade Full Stack Engineering Demo
            </span>
          </div>
        </div>
      }
      open={open}
      onCancel={onClose}
      footer={[
        <Button key="close" type="primary" onClick={onClose} className="bg-gradient-to-r from-purple-600 to-indigo-600 font-extrabold rounded-2xl px-6">
          Close Technical Showcase
        </Button>
      ]}
      width={720}
      className="recruiter-modal"
    >
      <div className="space-y-6 py-3 font-sans text-slate-200">
        
        {/* Banner Tag */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-950/80 via-slate-900 to-indigo-950/80 border border-purple-800/50 flex items-center justify-between">
          <div>
            <span className="font-black text-base text-purple-200 block">Candidate Portfolio Showcase</span>
            <span className="text-xs text-purple-300/80 font-medium">Demonstrates production architecture, algorithmic state, and responsive UI engineering.</span>
          </div>
          <Tag color="gold" className="m-0 font-black px-3 py-1 rounded-xl text-xs uppercase">
            HIRING READY
          </Tag>
        </div>

        {/* Tech Stack Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-[#0b1329] border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-sky-400 font-extrabold text-sm">
              <FontAwesomeIcon icon={faCode} /> Frontend Architecture
            </div>
            <ul className="text-xs space-y-1.5 text-slate-300 font-medium list-disc list-inside">
              <li>React 18 + Vite (Sub-400ms HMR builds)</li>
              <li>Ant Design 5 ConfigProvider Custom Tokens</li>
              <li>Tailwind CSS Glassmorphism Utility Layers</li>
              <li>Stateful Multi-Currency & Filter Logic</li>
            </ul>
          </div>

          <div className="p-4 rounded-2xl bg-[#0b1329] border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-emerald-400 font-extrabold text-sm">
              <FontAwesomeIcon icon={faServer} /> Backend REST API Layer
            </div>
            <ul className="text-xs space-y-1.5 text-slate-300 font-medium list-disc list-inside">
              <li>Node.js + Express REST API Server (Port 4000)</li>
              <li>In-Memory DB Data Provider & AJV Validation</li>
              <li>Robust Error Handling & Standardized Responses</li>
              <li>CORS & Security Middleware Stack</li>
            </ul>
          </div>
        </div>

        {/* Key Features Summary */}
        <div className="p-4 rounded-2xl bg-[#0b1329] border border-slate-800 space-y-3">
          <span className="font-extrabold text-sm text-cyan-400 block uppercase tracking-wider">
            ⚡ Standout Engineering Innovations
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="flex items-start gap-2">
              <FontAwesomeIcon icon={faBrain} className="text-purple-400 mt-0.5" />
              <span><strong>AI Risk Engine</strong>: Automated stability calculations and daily burn rate forecasting.</span>
            </div>
            <div className="flex items-start gap-2">
              <FontAwesomeIcon icon={faBolt} className="text-amber-400 mt-0.5" />
              <span><strong>1-Click Action Presets</strong>: Instant state mutation & transactional ledger logging.</span>
            </div>
            <div className="flex items-start gap-2">
              <FontAwesomeIcon icon={faLayerGroup} className="text-indigo-400 mt-0.5" />
              <span><strong>Compound Growth Simulator</strong>: Financial mathematics engine for 1-30 year wealth projections.</span>
            </div>
            <div className="flex items-start gap-2">
              <FontAwesomeIcon icon={faShieldHalved} className="text-emerald-400 mt-0.5" />
              <span><strong>Zero-Income Runway Gauge</strong>: Realtime liquidity safety cushion modeling.</span>
            </div>
          </div>
        </div>

      </div>
    </Modal>
  );
};

export default RecruiterSpotlightModal;

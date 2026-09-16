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
  faCircleCheck,
  faLaptopCode
} from '@fortawesome/free-solid-svg-icons';

const RecruiterSpotlightModal = ({ open, onClose }) => {
  return (
    <Modal
      title={
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-pink-500 via-purple-600 to-indigo-600 text-white flex items-center justify-center text-xl font-black shadow-lg shadow-pink-500/30">
            <FontAwesomeIcon icon={faStar} />
          </div>
          <div>
            <span className="font-black text-xl text-white block tracking-tight">
              Senior Technical Architecture & Recruiter Showcase 🌸
            </span>
            <span className="text-xs text-pink-300/80 font-semibold">
              Production-Grade Full Stack Financial Operating System
            </span>
          </div>
        </div>
      }
      open={open}
      onCancel={onClose}
      footer={[
        <Button key="close" type="primary" onClick={onClose} className="bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 font-extrabold rounded-2xl px-6 border-0 shadow-md">
          Close Technical Showcase ✨
        </Button>
      ]}
      width={780}
      className="recruiter-modal"
    >
      <div className="space-y-6 py-3 font-sans text-slate-200">
        
        {/* Banner Tag */}
        <div className="p-5 rounded-3xl bg-gradient-to-r from-pink-950/80 via-purple-950 to-slate-900 border border-pink-800/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-black text-lg text-pink-200 block">Candidate Portfolio & System Highlights</span>
              <Tag color="magenta" className="font-black rounded-lg text-[10px]">VERIFIED SENIOR TECH</Tag>
            </div>
            <span className="text-xs text-pink-300/80 font-medium">Built with React 18, Ant Design 5, Express REST API, and multi-currency financial calculation engines.</span>
          </div>
          <Tag color="gold" className="m-0 font-black px-4 py-2 rounded-2xl text-xs uppercase tracking-wider text-center border-amber-400/40">
            <FontAwesomeIcon icon={faLaptopCode} className="mr-1.5" />
            TOP RECRUITER PICK
          </Tag>
        </div>

        {/* Tech Stack Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-5 rounded-3xl bg-[#1d0918] border border-pink-900/40 space-y-3 shadow-inner">
            <div className="flex items-center gap-2 text-pink-400 font-black text-sm uppercase tracking-wider">
              <FontAwesomeIcon icon={faCode} /> Frontend Architecture
            </div>
            <ul className="text-xs space-y-2 text-pink-100/90 font-semibold list-none pl-0">
              <li className="flex items-center gap-2">
                <FontAwesomeIcon icon={faCircleCheck} className="text-emerald-400" />
                <span>React 18 + Vite (Zero-lag HMR & 1500+ Module Transpilation)</span>
              </li>
              <li className="flex items-center gap-2">
                <FontAwesomeIcon icon={faCircleCheck} className="text-emerald-400" />
                <span>Ant Design 5 Token Providers + Tailwind Glassmorphism</span>
              </li>
              <li className="flex items-center gap-2">
                <FontAwesomeIcon icon={faCircleCheck} className="text-emerald-400" />
                <span>Stateful Multi-Currency Conversion Engine ($ / € / £ / Rs)</span>
              </li>
              <li className="flex items-center gap-2">
                <FontAwesomeIcon icon={faCircleCheck} className="text-emerald-400" />
                <span>Interactive Recharts & Custom SVG Metric Visualizations</span>
              </li>
            </ul>
          </div>

          <div className="p-5 rounded-3xl bg-[#1d0918] border border-pink-900/40 space-y-3 shadow-inner">
            <div className="flex items-center gap-2 text-purple-400 font-black text-sm uppercase tracking-wider">
              <FontAwesomeIcon icon={faServer} /> Backend API & Data Layer
            </div>
            <ul className="text-xs space-y-2 text-pink-100/90 font-semibold list-none pl-0">
              <li className="flex items-center gap-2">
                <FontAwesomeIcon icon={faCircleCheck} className="text-emerald-400" />
                <span>Node.js + Express RESTful API Server (Port 4000)</span>
              </li>
              <li className="flex items-center gap-2">
                <FontAwesomeIcon icon={faCircleCheck} className="text-emerald-400" />
                <span>Data Validation Stack & Centralized Error Handlers</span>
              </li>
              <li className="flex items-center gap-2">
                <FontAwesomeIcon icon={faCircleCheck} className="text-emerald-400" />
                <span>CRUD Controllers for Transactions, Goals & Presets</span>
              </li>
              <li className="flex items-center gap-2">
                <FontAwesomeIcon icon={faCircleCheck} className="text-emerald-400" />
                <span>Sub-15ms Local Execution Latency</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Standout Engineering Features */}
        <div className="p-5 rounded-3xl bg-[#1d0918] border border-pink-900/40 space-y-3">
          <span className="font-black text-sm text-pink-300 block uppercase tracking-wider">
            ⚡ Key Engineering & Algorithmic Modules
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
            <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-pink-950/20 border border-pink-900/30">
              <FontAwesomeIcon icon={faBrain} className="text-pink-400 text-sm mt-0.5" />
              <div>
                <strong className="block text-pink-200">AI Risk Intelligence Engine</strong>
                <span className="text-pink-300/70">Calculates stability index, daily burn rate & savings velocity.</span>
              </div>
            </div>
            <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-purple-950/20 border border-purple-900/30">
              <FontAwesomeIcon icon={faBolt} className="text-amber-400 text-sm mt-0.5" />
              <div>
                <strong className="block text-purple-200">1-Click Presets & Vibe Diary</strong>
                <span className="text-purple-300/70">Instant state mutation, log buttons & weekly vibe streak logger.</span>
              </div>
            </div>
            <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-indigo-950/20 border border-indigo-900/30">
              <FontAwesomeIcon icon={faLayerGroup} className="text-indigo-400 text-sm mt-0.5" />
              <div>
                <strong className="block text-indigo-200">Compound Growth Simulator</strong>
                <span className="text-indigo-300/70">Financial mathematics engine for 1-30 year wealth projections.</span>
              </div>
            </div>
            <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-emerald-950/20 border border-emerald-900/30">
              <FontAwesomeIcon icon={faShieldHalved} className="text-emerald-400 text-sm mt-0.5" />
              <div>
                <strong className="block text-emerald-200">Emergency Runway Cushion</strong>
                <span className="text-emerald-300/70">Zero-income runway modeling based on current vault balance.</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </Modal>
  );
};

export default RecruiterSpotlightModal;

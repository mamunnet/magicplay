import React, { useState } from 'react';
import { PolicyModal } from './PolicyModal';

export const Footer: React.FC = () => {
  const [activePolicy, setActivePolicy] = useState<string | null>(null);

  const policyContents = {
    gambling: `
      <h3>Gambling Policy</h3>
      <p>1. Age Restriction</p>
      <ul>
        <li>Users must be 18 years or older to participate</li>
        <li>Age verification is required during registration</li>
      </ul>
      <p>2. Responsible Gaming</p>
      <ul>
        <li>Set personal betting limits</li>
        <li>Self-exclusion options available</li>
        <li>Access to gambling addiction resources</li>
      </ul>
      <p>3. Fair Play</p>
      <ul>
        <li>Random Number Generator (RNG) certified</li>
        <li>Regular audits by independent bodies</li>
        <li>Transparent odds and payouts</li>
      </ul>
    `,
    privacy: `
      <h3>Privacy Policy</h3>
      <p>1. Information Collection</p>
      <ul>
        <li>Personal identification information</li>
        <li>Transaction data</li>
        <li>Gaming activity</li>
      </ul>
      <p>2. Data Protection</p>
      <ul>
        <li>SSL encryption for all data</li>
        <li>Secure payment processing</li>
        <li>No sharing with third parties</li>
      </ul>
      <p>3. User Rights</p>
      <ul>
        <li>Access to personal data</li>
        <li>Right to data deletion</li>
        <li>Data portability options</li>
      </ul>
    `,
    terms: `
      <h3>Terms of Service</h3>
      <p>1. Account Rules</p>
      <ul>
        <li>One account per user</li>
        <li>Accurate information required</li>
        <li>Account security responsibilities</li>
      </ul>
      <p>2. Payment Terms</p>
      <ul>
        <li>Minimum deposit requirements</li>
        <li>Withdrawal processing times</li>
        <li>Verification procedures</li>
      </ul>
      <p>3. User Conduct</p>
      <ul>
        <li>Fair play requirements</li>
        <li>Prohibited activities</li>
        <li>Account termination conditions</li>
      </ul>
    `
  };

  return (
    <>
      <footer className="relative w-full bg-[#111827] mt-16">
        {/* Glow Effect */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-900/5 to-blue-900/10 pointer-events-none" />
        
        {/* Top Border Glow */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />
        
        {/* Content Container */}
        <div className="relative w-full">
          <div className="w-full py-4">
            <div className="flex flex-col md:flex-row justify-between items-center px-8">
              <div className="text-sm text-gray-400 mb-4 md:mb-0">
                &copy; {new Date().getFullYear()} MagicPlay247. All rights reserved.
              </div>
              <div className="flex space-x-8">
                <button 
                  onClick={() => setActivePolicy('gambling')}
                  className="text-sm text-gray-400 hover:text-blue-400 transition-colors relative group"
                >
                  <span>Gambling Policy</span>
                  <span className="absolute -bottom-1 left-0 w-0 h-px bg-blue-400 transition-all duration-300 group-hover:w-full"></span>
                </button>
                <button 
                  onClick={() => setActivePolicy('privacy')}
                  className="text-sm text-gray-400 hover:text-blue-400 transition-colors relative group"
                >
                  <span>Privacy Policy</span>
                  <span className="absolute -bottom-1 left-0 w-0 h-px bg-blue-400 transition-all duration-300 group-hover:w-full"></span>
                </button>
                <button 
                  onClick={() => setActivePolicy('terms')}
                  className="text-sm text-gray-400 hover:text-blue-400 transition-colors relative group"
                >
                  <span>Terms of Service</span>
                  <span className="absolute -bottom-1 left-0 w-0 h-px bg-blue-400 transition-all duration-300 group-hover:w-full"></span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </footer>

      <PolicyModal
        isOpen={activePolicy === 'gambling'}
        onClose={() => setActivePolicy(null)}
        title="Gambling Policy"
        content={policyContents.gambling}
      />
      <PolicyModal
        isOpen={activePolicy === 'privacy'}
        onClose={() => setActivePolicy(null)}
        title="Privacy Policy"
        content={policyContents.privacy}
      />
      <PolicyModal
        isOpen={activePolicy === 'terms'}
        onClose={() => setActivePolicy(null)}
        title="Terms of Service"
        content={policyContents.terms}
      />
    </>
  );
};

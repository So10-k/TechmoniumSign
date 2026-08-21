const PAGE_WIDTH = 612;
const PAGE_HEIGHT = 792;

const field = (name, x, y, width = 205) => ({ name, x, y, width, height: 24 });

const role = (name, id, x, color) => ({
  name,
  id,
  color,
  widgets: [
    { type: 'signature', name: `${name} signature`, x, y: 650, width: 180, height: 42 },
    { type: 'date', name: `${name} signed date`, x, y: 710, width: 125, height: 24 },
  ],
});

const twoPartyRoles = (left, right) => [
  role(left, `global-${left.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`, 72, '#4868a8'),
  role(right, `global-${right.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`, 350, '#9b5c72'),
];

const commonFields = (partyA, partyB) => [
  field('Effective date', 72, 118),
  field(partyA, 335, 118),
  field(partyB, 72, 164),
  field('Governing state or jurisdiction', 335, 164),
];

const templates = [
  {
    slug: 'mutual-nondisclosure-agreement',
    name: 'Global · Mutual NDA',
    category: 'Confidentiality',
    description: 'A balanced two-way confidentiality agreement for early business discussions.',
    fields: commonFields('First party legal name', 'Second party legal name'),
    roles: twoPartyRoles('First Party', 'Second Party'),
    sections: [
      [
        'Purpose',
        'The parties expect to discuss a possible business relationship and may exchange confidential information solely to evaluate or pursue that relationship.',
      ],
      [
        'Confidential information',
        'Confidential information includes non-public business, product, technical, customer, financial, and operational information disclosed in any form and reasonably understood to be confidential.',
      ],
      [
        'Exclusions',
        'Confidential information does not include information the recipient can document was already known without restriction, becomes public without breach, is received lawfully from another source, or is independently developed.',
      ],
      [
        'Use and protection',
        'Each recipient will use confidential information only for the stated purpose, protect it with reasonable care, and disclose it only to representatives who need it and are bound by comparable duties.',
      ],
      [
        'Required disclosure',
        'A recipient may disclose information when legally required after giving prompt notice when permitted and reasonably assisting efforts to limit disclosure.',
      ],
      [
        'Return and term',
        'On request, each recipient will return or destroy confidential material, subject to routine backups and legal retention. These duties continue for three years, while trade-secret duties last as long as the information remains a trade secret.',
      ],
      [
        'No license or commitment',
        'No intellectual-property license is granted, and neither party is required to proceed with a transaction. Information is provided without warranties except as stated in a later written agreement.',
      ],
    ],
  },
  {
    slug: 'unilateral-nondisclosure-agreement',
    name: 'Global · One-way NDA',
    category: 'Confidentiality',
    description: 'A one-way NDA when one business is sharing protected information.',
    fields: commonFields('Disclosing party legal name', 'Receiving party legal name'),
    roles: twoPartyRoles('Disclosing Party', 'Receiving Party'),
    sections: [
      [
        'Purpose',
        'The disclosing party may provide non-public information so the receiving party can evaluate or perform the business purpose agreed by the parties.',
      ],
      [
        'Protected information',
        'Protected information includes non-public commercial, technical, financial, customer, product, security, and operational information, including notes or analyses derived from it.',
      ],
      [
        'Recipient duties',
        'The receiving party will use protected information only for the purpose, safeguard it with reasonable care, and share it only with representatives who need it and owe confidentiality duties.',
      ],
      [
        'Standard exclusions',
        'The duties do not cover information documented as previously known without restriction, public without breach, lawfully received from another source, or independently developed without using protected information.',
      ],
      [
        'Compelled disclosure',
        'If disclosure is legally required, the receiving party will provide notice when permitted and disclose only what is legally required.',
      ],
      [
        'Return and duration',
        'On request, protected materials will be returned or destroyed, except for lawful archival copies. Confidentiality duties continue for three years, and trade-secret duties continue while protected by law.',
      ],
      [
        'Ownership',
        'All protected information remains the disclosing party’s property. No license, warranty, partnership, or obligation to complete a transaction is created.',
      ],
    ],
  },
  {
    slug: 'employment-offer-letter',
    name: 'Global · Employment Offer',
    category: 'People',
    description:
      'A clear employment offer letter with editable commercial terms and acceptance fields.',
    fields: [
      field('Offer date', 72, 118),
      field('Employer legal name', 335, 118),
      field('Candidate full name', 72, 164),
      field('Role title', 335, 164),
      field('Start date', 72, 210),
      field('Compensation and pay period', 335, 210),
    ],
    roles: twoPartyRoles('Employer', 'Candidate'),
    sections: [
      [
        'Offer',
        'The employer is pleased to offer the candidate the role stated above, reporting to the manager designated by the employer.',
      ],
      [
        'Compensation',
        'The candidate will receive the compensation entered above, subject to normal payroll practices, required withholding, and written compensation policies.',
      ],
      [
        'Benefits and expenses',
        'Eligibility for benefits, paid time off, bonuses, and expense reimbursement is governed by the employer’s current plans and policies, which may change as permitted by law.',
      ],
      [
        'Conditions',
        'This offer may be conditioned on identity and work-authorization verification, reference or background checks where lawful, and execution of applicable confidentiality or invention-assignment terms.',
      ],
      [
        'Employment relationship',
        'The employment relationship and any at-will status are governed by applicable law and the employer’s written policies. Nothing in this letter guarantees employment for a fixed term unless expressly stated.',
      ],
      [
        'Acceptance',
        'The candidate accepts the offer by signing below and returning it by the deadline communicated by the employer. This letter and incorporated written policies state the offer terms.',
      ],
    ],
  },
  {
    slug: 'independent-contractor-agreement',
    name: 'Global · Contractor Agreement',
    category: 'People',
    description:
      'A general independent-contractor agreement covering work, payment, ownership, and confidentiality.',
    fields: [
      field('Effective date', 72, 118),
      field('Company legal name', 335, 118),
      field('Contractor legal name', 72, 164),
      field('Services summary', 335, 164),
      field('Fee and payment schedule', 72, 210, 468),
    ],
    roles: twoPartyRoles('Company', 'Contractor'),
    sections: [
      [
        'Services',
        'The contractor will perform the services and deliverables described above and in any signed statement of work, using professional skill and reasonable care.',
      ],
      [
        'Fees and expenses',
        'The company will pay the agreed fees after receiving accurate invoices. Expenses require advance written approval and reasonable documentation.',
      ],
      [
        'Independent status',
        'The contractor controls the manner and means of performing the services and is responsible for taxes, insurance, permits, and personnel, subject to applicable law.',
      ],
      [
        'Work product',
        'Upon full payment, deliverables created specifically for the company transfer to the company to the extent permitted by law. Pre-existing tools remain with their owner, with a license as needed to use the deliverables.',
      ],
      [
        'Confidentiality and security',
        'The contractor will protect company confidential information, follow reasonable security requirements, and promptly return company property at the end of the engagement.',
      ],
      [
        'Term and termination',
        'Either party may terminate as stated in a signed statement of work or, if unstated, on reasonable written notice. The company will pay for accepted work completed through termination.',
      ],
      [
        'General terms',
        'Neither party may bind the other. Changes must be written and signed. The parties will comply with applicable law, and unenforceable terms will be limited without invalidating the remainder.',
      ],
    ],
  },
  {
    slug: 'general-services-agreement',
    name: 'Global · Services Agreement',
    category: 'Commercial',
    description:
      'A practical services agreement for agencies, consultants, and service businesses.',
    fields: [
      field('Effective date', 72, 118),
      field('Client legal name', 335, 118),
      field('Provider legal name', 72, 164),
      field('Services or project name', 335, 164),
      field('Fees and billing cadence', 72, 210, 468),
    ],
    roles: twoPartyRoles('Client', 'Provider'),
    sections: [
      [
        'Services and changes',
        'The provider will perform the services described above and in signed statements of work. Scope, schedule, or price changes require written approval by both parties.',
      ],
      [
        'Client responsibilities',
        'The client will provide timely access, decisions, content, and approvals. Schedule effects caused by delayed client input will be handled reasonably and documented.',
      ],
      [
        'Fees',
        'The client will pay undisputed invoices according to the billing terms entered above. Each party is responsible for its own taxes except taxes the other party must collect by law.',
      ],
      [
        'Ownership',
        'Each party retains its pre-existing materials. Ownership or licensing of new deliverables follows the applicable statement of work and is effective after payment of the related fees.',
      ],
      [
        'Confidentiality',
        'Each party will protect the other’s non-public information, use it only to perform this agreement, and disclose it only to people with a need to know and similar obligations.',
      ],
      [
        'Warranty and liability',
        'Each party will perform its obligations professionally and lawfully. Any specific warranties, acceptance criteria, liability limits, or indemnities must be stated in a signed statement of work or addendum.',
      ],
      [
        'Term and disputes',
        'The agreement continues until terminated under a statement of work or on reasonable written notice. Accrued payment, confidentiality, ownership, and dispute terms survive as applicable.',
      ],
    ],
  },
  {
    slug: 'consulting-statement-of-work',
    name: 'Global · Consulting SOW',
    category: 'Commercial',
    description: 'A focused statement of work for deliverables, milestones, fees, and acceptance.',
    fields: [
      field('SOW effective date', 72, 118),
      field('Client legal name', 335, 118),
      field('Consultant legal name', 72, 164),
      field('Project name', 335, 164),
      field('Project fee or rate', 72, 210),
      field('Target completion date', 335, 210),
    ],
    roles: twoPartyRoles('Client', 'Consultant'),
    sections: [
      [
        'Objective',
        'The consultant will help the client achieve the project objective described above under the parties’ governing services agreement, if any.',
      ],
      [
        'Deliverables',
        'Deliverables, formats, owners, and milestone dates will be recorded in the project workspace or a written schedule approved by both parties.',
      ],
      [
        'Assumptions',
        'The client will provide timely access to people, systems, brand materials, content, and decisions needed for the work. Dependencies and exclusions should be documented before work begins.',
      ],
      [
        'Review and acceptance',
        'The client will review each deliverable promptly and provide specific feedback. A deliverable is accepted when approved in writing or used in production, unless different criteria are written here.',
      ],
      [
        'Fees and invoicing',
        'Fees follow the rate or project price entered above. Approved out-of-scope work requires a written change and may affect timing and cost.',
      ],
      [
        'Changes',
        'Either party may request a change. No requested change is binding until both parties agree in writing on scope, timing, and price effects.',
      ],
      [
        'Order of precedence',
        'If this statement of work conflicts with a governing services agreement, that agreement controls unless this statement expressly identifies and overrides the conflicting term.',
      ],
    ],
  },
];

module.exports = { PAGE_HEIGHT, PAGE_WIDTH, templates };

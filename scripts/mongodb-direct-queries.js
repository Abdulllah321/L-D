/**
 * Direct MongoDB Queries for Updating Regulatory Training Decks
 * Run these in MongoDB Shell or Compass
 */

// ============================================
// COM Regulatory Training Deck
// ============================================

// Business Continuity Management (BCM)
db.learningpaths.updateMany(
  { title: "COM Regulatory Training Deck" },
  {
    $set: {
      "trainings.$[training].courseOverview": "This e-course is an updated, animated and engaging learning content and has built-in case scenarios with respective knowledge checks. Due to its nature of being a SBP Regulatory training, it is mandatory for all the staff as it covers all important aspects of its objectives, major focal points, BCM Lifecycle and its Components, Crisis Management Planning and consequest communication.",
      "trainings.$[training].frequency": "Annually"
    }
  },
  {
    arrayFilters: [
      { "training.title": "Business Continuity Management (BCM)" }
    ]
  }
);

// Operations Risk Management
db.learningpaths.updateMany(
  { title: "COM Regulatory Training Deck" },
  {
    $set: {
      "trainings.$[training].courseOverview": "This eCourse's key takeaways are:\n- Demonstrate effectiveness of ORM awareness culture at Bank-wide level.\n- Enhance understanding of ORM tools and associated terminologies.\n- Promote risk identification, management, monitoring and timely/ accurate reporting of operational issues/incidents\n- Take appropriate actions/ root-cause analysis at HO/ ORM level, based on identification and timely reporting of the issues/ incidents.\n- Reduction in operational losses by enhancing control environment (through process design improvements).",
      "trainings.$[training].frequency": "Annually"
    }
  },
  {
    arrayFilters: [
      { "training.title": "Operations Risk Management" }
    ]
  }
);

// Compliance Essentials
db.learningpaths.updateMany(
  { title: "COM Regulatory Training Deck" },
  {
    $set: {
      "trainings.$[training].courseOverview": "This course consists of quiz that is mandatory for all new hires as it is one of the conditions for job confirmation.",
      "trainings.$[training].frequency": "For new hired"
    }
  },
  {
    arrayFilters: [
      { "training.title": "Compliance Essentials" }
    ]
  }
);

// AML/CFT Refresher
db.learningpaths.updateMany(
  { title: "COM Regulatory Training Deck" },
  {
    $set: {
      "trainings.$[training].courseOverview": "The e-course is updated with the current knowledge related to CAAML that includes interactive activities at multiple levels, and has in-built knowledge checks at regular intervals apart from a comprehsensive quiz.",
      "trainings.$[training].frequency": "Annually"
    }
  },
  {
    arrayFilters: [
      { "training.title": "AML/CFT Refresher" }
    ]
  }
);

// Cyber Security
db.learningpaths.updateMany(
  { title: "COM Regulatory Training Deck" },
  {
    $set: {
      "trainings.$[training].courseOverview": "This eCourse covers the Cyber Security highlights:\n- Network and Internet Access\n- Computer Software License\n- Cyber Security Incidents\n- Cyber Attack\n- Social Engineering & Safe Practices",
      "trainings.$[training].frequency": "Annually"
    }
  },
  {
    arrayFilters: [
      { "training.title": "Cyber Security" }
    ]
  }
);

// CAF-FTC
db.learningpaths.updateMany(
  { title: "COM Regulatory Training Deck" },
  {
    $set: {
      "trainings.$[training].courseOverview": "This comprehensive e-course provides an in-depth exploration of essential financial conduct standards, including Consumer Protection, Banking Conduct, the Guiding Principles of Fair Treatment to Customers (FTC), and the Conduct Assessment Framework (CAF).",
      "trainings.$[training].frequency": "Annually"
    }
  },
  {
    arrayFilters: [
      { "training.title": "CAF-FTC" }
    ]
  }
);

// Compliance Risk Management
db.learningpaths.updateMany(
  { title: "COM Regulatory Training Deck" },
  {
    $set: {
      "trainings.$[training].courseOverview": "This courses covers, compliance risk, potential areas prone to compliance risk, essentials of CRM, and mitigating compliance risk",
      "trainings.$[training].frequency": "Annually"
    }
  },
  {
    arrayFilters: [
      { "training.title": "Compliance Risk Management" }
    ]
  }
);

// Banca Takaful
db.learningpaths.updateMany(
  { title: "COM Regulatory Training Deck" },
  {
    $set: {
      "trainings.$[training].courseOverview": "This course covers faysal bank's banca products, such as health product, generla and life products, unit link products.",
      "trainings.$[training].frequency": "Tagging done for those staff who perform Bancatakaful"
    }
  },
  {
    arrayFilters: [
      { "training.title": "Banca Takaful" }
    ]
  }
);

// ============================================
// AOM Regulatory Training Deck
// ============================================

// Business Continuity Management (BCM)
db.learningpaths.updateMany(
  { title: "AOM Regulatory Training Deck" },
  {
    $set: {
      "trainings.$[training].courseOverview": "This e-course is an updated, animated and engaging learning content and has built-in case scenarios with respective knowledge checks. Due to its nature of being a SBP Regulatory training, it is mandatory for all the staff as it covers all important aspects of its objectives, major focal points, BCM Lifecycle and its Components, Crisis Management Planning and consequest communication.",
      "trainings.$[training].frequency": "Annually"
    }
  },
  {
    arrayFilters: [
      { "training.title": "Business Continuity Management (BCM)" }
    ]
  }
);

// Operations Risk Management
db.learningpaths.updateMany(
  { title: "AOM Regulatory Training Deck" },
  {
    $set: {
      "trainings.$[training].courseOverview": "This eCourse's key takeaways are:\n- Demonstrate effectiveness of ORM awareness culture at Bank-wide level.\n- Enhance understanding of ORM tools and associated terminologies.\n- Promote risk identification, management, monitoring and timely/ accurate reporting of operational issues/incidents\n- Take appropriate actions/ root-cause analysis at HO/ ORM level, based on identification and timely reporting of the issues/ incidents.\n- Reduction in operational losses by enhancing control environment (through process design improvements).",
      "trainings.$[training].frequency": "Annually"
    }
  },
  {
    arrayFilters: [
      { "training.title": "Operations Risk Management" }
    ]
  }
);

// Compliance Essentials
db.learningpaths.updateMany(
  { title: "AOM Regulatory Training Deck" },
  {
    $set: {
      "trainings.$[training].courseOverview": "This course consists of quiz that is mandatory for all new hires as it is one of the conditions for job confirmation.",
      "trainings.$[training].frequency": "For new hired"
    }
  },
  {
    arrayFilters: [
      { "training.title": "Compliance Essentials" }
    ]
  }
);

// AML/CFT Refresher
db.learningpaths.updateMany(
  { title: "AOM Regulatory Training Deck" },
  {
    $set: {
      "trainings.$[training].courseOverview": "The e-course is updated with the current knowledge related to CAAML that includes interactive activities at multiple levels, and has in-built knowledge checks at regular intervals apart from a comprehsensive quiz.",
      "trainings.$[training].frequency": "Annually"
    }
  },
  {
    arrayFilters: [
      { "training.title": "AML/CFT Refresher" }
    ]
  }
);

// Cyber Security
db.learningpaths.updateMany(
  { title: "AOM Regulatory Training Deck" },
  {
    $set: {
      "trainings.$[training].courseOverview": "This eCourse covers the Cyber Security highlights:\n- Network and Internet Access\n- Computer Software License\n- Cyber Security Incidents\n- Cyber Attack\n- Social Engineering & Safe Practices",
      "trainings.$[training].frequency": "Annually"
    }
  },
  {
    arrayFilters: [
      { "training.title": "Cyber Security" }
    ]
  }
);

// CAF-FTC
db.learningpaths.updateMany(
  { title: "AOM Regulatory Training Deck" },
  {
    $set: {
      "trainings.$[training].courseOverview": "This comprehensive e-course provides an in-depth exploration of essential financial conduct standards, including Consumer Protection, Banking Conduct, the Guiding Principles of Fair Treatment to Customers (FTC), and the Conduct Assessment Framework (CAF).",
      "trainings.$[training].frequency": "Annually"
    }
  },
  {
    arrayFilters: [
      { "training.title": "CAF-FTC" }
    ]
  }
);

// Basics of FX Regulations
db.learningpaths.updateMany(
  { title: "AOM Regulatory Training Deck" },
  {
    $set: {
      "trainings.$[training].courseOverview": "This course covers:\n1. Understand the practical aspects of Foreign Exchange Regime\n2. Gain Knowledge about Approved FCY Remittances\n3. Know about the Private FCY Accounts other than Foreign Trade Transactions\n4. Provide ready reference material for Branches and CPU staff",
      "trainings.$[training].frequency": "Annually"
    }
  },
  {
    arrayFilters: [
      { "training.title": "Basics of FX Regulations" }
    ]
  }
);

// Compliance Risk Management
db.learningpaths.updateMany(
  { title: "AOM Regulatory Training Deck" },
  {
    $set: {
      "trainings.$[training].courseOverview": "This courses covers, compliance risk, potential areas prone to compliance risk, essentials of CRM, and mitigating compliance risk",
      "trainings.$[training].frequency": "Annually"
    }
  },
  {
    arrayFilters: [
      { "training.title": "Compliance Risk Management" }
    ]
  }
);

// ============================================
// ROM Regulatory Training Deck
// ============================================

// Business Continuity Management (BCM)
db.learningpaths.updateMany(
  { title: "ROM Regulatory Training Deck" },
  {
    $set: {
      "trainings.$[training].courseOverview": "This e-course is an updated, animated and engaging learning content and has built-in case scenarios with respective knowledge checks. Due to its nature of being a SBP Regulatory training, it is mandatory for all the staff as it covers all important aspects of its objectives, major focal points, BCM Lifecycle and its Components, Crisis Management Planning and consequest communication.",
      "trainings.$[training].frequency": "Annually"
    }
  },
  {
    arrayFilters: [
      { "training.title": "Business Continuity Management (BCM)" }
    ]
  }
);

// Operations Risk Management
db.learningpaths.updateMany(
  { title: "ROM Regulatory Training Deck" },
  {
    $set: {
      "trainings.$[training].courseOverview": "This eCourse's key takeaways are:\n- Demonstrate effectiveness of ORM awareness culture at Bank-wide level.\n- Enhance understanding of ORM tools and associated terminologies.\n- Promote risk identification, management, monitoring and timely/ accurate reporting of operational issues/incidents\n- Take appropriate actions/ root-cause analysis at HO/ ORM level, based on identification and timely reporting of the issues/ incidents.\n- Reduction in operational losses by enhancing control environment (through process design improvements).",
      "trainings.$[training].frequency": "Annually"
    }
  },
  {
    arrayFilters: [
      { "training.title": "Operations Risk Management" }
    ]
  }
);

// Compliance Essentials
db.learningpaths.updateMany(
  { title: "ROM Regulatory Training Deck" },
  {
    $set: {
      "trainings.$[training].courseOverview": "This course consists of quiz that is mandatory for all new hires as it is one of the conditions for job confirmation.",
      "trainings.$[training].frequency": "For new hired"
    }
  },
  {
    arrayFilters: [
      { "training.title": "Compliance Essentials" }
    ]
  }
);

// AML/CFT Refresher
db.learningpaths.updateMany(
  { title: "ROM Regulatory Training Deck" },
  {
    $set: {
      "trainings.$[training].courseOverview": "The e-course is updated with the current knowledge related to CAAML that includes interactive activities at multiple levels, and has in-built knowledge checks at regular intervals apart from a comprehsensive quiz.",
      "trainings.$[training].frequency": "Annually"
    }
  },
  {
    arrayFilters: [
      { "training.title": "AML/CFT Refresher" }
    ]
  }
);

// Cyber Security
db.learningpaths.updateMany(
  { title: "ROM Regulatory Training Deck" },
  {
    $set: {
      "trainings.$[training].courseOverview": "This eCourse covers the Cyber Security highlights:\n- Network and Internet Access\n- Computer Software License\n- Cyber Security Incidents\n- Cyber Attack\n- Social Engineering & Safe Practices",
      "trainings.$[training].frequency": "Annually"
    }
  },
  {
    arrayFilters: [
      { "training.title": "Cyber Security" }
    ]
  }
);

// CAF-FTC
db.learningpaths.updateMany(
  { title: "ROM Regulatory Training Deck" },
  {
    $set: {
      "trainings.$[training].courseOverview": "This comprehensive e-course provides an in-depth exploration of essential financial conduct standards, including Consumer Protection, Banking Conduct, the Guiding Principles of Fair Treatment to Customers (FTC), and the Conduct Assessment Framework (CAF).",
      "trainings.$[training].frequency": "Annually"
    }
  },
  {
    arrayFilters: [
      { "training.title": "CAF-FTC" }
    ]
  }
);

// Basics of FX Regulations
db.learningpaths.updateMany(
  { title: "ROM Regulatory Training Deck" },
  {
    $set: {
      "trainings.$[training].courseOverview": "This course covers:\n1. Understand the practical aspects of Foreign Exchange Regime\n2. Gain Knowledge about Approved FCY Remittances\n3. Know about the Private FCY Accounts other than Foreign Trade Transactions\n4. Provide ready reference material for Branches and CPU staff",
      "trainings.$[training].frequency": "Annually"
    }
  },
  {
    arrayFilters: [
      { "training.title": "Basics of FX Regulations" }
    ]
  }
);

// Compliance Risk Management
db.learningpaths.updateMany(
  { title: "ROM Regulatory Training Deck" },
  {
    $set: {
      "trainings.$[training].courseOverview": "This courses covers, compliance risk, potential areas prone to compliance risk, essentials of CRM, and mitigating compliance risk",
      "trainings.$[training].frequency": "Annually"
    }
  },
  {
    arrayFilters: [
      { "training.title": "Compliance Risk Management" }
    ]
  }
);

// ATM/FLM
db.learningpaths.updateMany(
  { title: "ROM Regulatory Training Deck" },
  {
    $set: {
      "trainings.$[training].courseOverview": "Objective of this course is to guide ATM custodians to perform best practices on FBL ATMs to reduce ATM down time & prevent from ATM theft / skimming and cash deposit machine",
      "trainings.$[training].frequency": "Annually"
    }
  },
  {
    arrayFilters: [
      { "training.title": "ATM/FLM" }
    ]
  }
);


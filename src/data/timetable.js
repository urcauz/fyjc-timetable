// Time slots for the schedule
export const TIME_SLOTS = [
  '10:20–11:00',
  '11:00–11:40',
  '11:40–12:20',
  '12:20–1:00',
  '1:00–1:40',
  '1:40–2:20',
  '2:20–3:00',
  '3:00–3:40',
  '3:40–4:20',
  '4:20–5:00',
  '5:00–5:40'
];

// Constant for empty/blank time slots
const BLANK = '—';

// Division schedules organized by division and day
export const DIVISIONS = {
  'Division I': {
    Monday: [
      'COMP.SC. PR / BIOLOGY PR',
      'COMP.SC. PR / BIOLOGY PR',
      'COMP.SC. PR / BIOLOGY PR',
      'COMP.SC. PR / BIOLOGY PR',
      'MATHS-102',
      'PHY-102',
      'BIO-224 / CS-102',
      'GEO-224 / CS-102',
      'ENG-102',
      'EVS-102',
      'EVS-102'
    ],
    Tuesday: [
      BLANK,
      BLANK,
      BLANK,
      BLANK,
      'CHEM-102',
      'MATHS-102',
      'PHY-102',
      'ENG-102',
      'HPE-102',
      'HPE-102',
      BLANK
    ],
    Wednesday: [
      'A1 & A2 : PHYSICS PR / A3 & A4 : CHEMISTRY PR',
      'A1 & A2 : PHYSICS PR / A3 & A4 : CHEMISTRY PR',
      'A1 & A2 : PHYSICS PR / A3 & A4 : CHEMISTRY PR',
      'A1 & A2 : PHYSICS PR / A3 & A4 : CHEMISTRY PR',
      'GEO-224 / CS-102',
      'HIN-102 / MAR-224 / CS-LAB',
      'A1 & A2 : PHYSICS PR / A3 & A4 : CHEMISTRY PR',
      'A1 & A2 : PHYSICS PR / A3 & A4 : CHEMISTRY PR',
      'A1 & A2 : PHYSICS PR / A3 & A4 : CHEMISTRY PR',
      'A1 & A2 : PHYSICS PR / A3 & A4 : CHEMISTRY PR',
      BLANK
    ],
    Thursday: [
      BLANK,
      BLANK,
      BLANK,
      BLANK,
      'PHY-102',
      'HIN-102 / MAR-224 / CS-LAB',
      'CHEM-102',
      'BIO-224',
      'GEO-224',
      'MATHS-102',
      BLANK
    ],
    Friday: [
      'GEO PR-224',
      'GEO PR-224',
      'GEO PR-224',
      'GEO PR-224',
      'CHEM-102',
      'HIN-102 / MAR-224 / CS-LAB',
      'BIO-224 / CS-LAB',
      'MATHS-102',
      'ENG-102',
      'EVS-102',
      'EVS-102'
    ],
    Saturday: [
      'MATHS PR-224',
      'MATHS PR-224',
      'MATHS PR-224',
      'MATHS PR-224',
      'PHY-102',
      'HIN-102 / MAR-224 / EL-LAB',
      'CHEM-102',
      'BIO-224',
      'GEO-224',
      'ENG-102',
      BLANK
    ]
  },

  'Division II': {
    Monday: [
      'B1 & B2: PHYSICS PR / B3 & B4: CHEMISTRY PR',
      'B1 & B2: PHYSICS PR / B3 & B4: CHEMISTRY PR',
      'B1 & B2: PHYSICS PR / B3 & B4: CHEMISTRY PR',
      'B3 & B4: PHYSICS PR / B1 & B2: CHEMISTRY PR',
      'PHY-211',
      'CHEM-211',
      'B3 & B4: PHYSICS PR / B1 & B2: CHEMISTRY PR',
      'B3 & B4: PHYSICS PR / B1 & B2: CHEMISTRY PR',
      'B3 & B4: PHYSICS PR / B1 & B2: CHEMISTRY PR',
      'B3 & B4: PHYSICS PR / B1 & B2: CHEMISTRY PR',
      BLANK
    ],
    Tuesday: [
      'BIOLOGY PR',
      'BIOLOGY PR',
      'BIOLOGY PR',
      'BIOLOGY PR',
      'CHEM-211',
      'PHY-211',
      'BIO-211 / EL-LAB',
      'MATHS-211',
      'MATHS-211',
      BLANK,
      BLANK
    ],
    Wednesday: [
      'ELECTRONICS PR',
      'ELECTRONICS PR',
      'ELECTRONICS PR',
      'ELECTRONICS PR',
      'BIO-211 / EL-LAB',
      'HIN-102 / MAR-224 / EL-LAB',
      'PHY-211',
      'ENG-211',
      'HPE-211',
      'HPE-211',
      BLANK
    ],
    Thursday: [
      'ELECTRONICS PR',
      'ELECTRONICS PR',
      'ELECTRONICS PR',
      'ELECTRONICS PR',
      'BIO-211 / EL-LAB',
      'HIN-102 / MAR-224 / EL-LAB',
      'MATHS PR-211',
      'MATHS PR-211',
      'ENG-211',
      'EVS-211',
      'EVS-211' 
    ],
    Friday: [
      BLANK,
      BLANK,
      BLANK,
      BLANK,
      'CHEM-211',
      'HIN-102 / MAR-224 / EL-LAB',
      'MATHS PR-211',
      'MATHS PR-211',
      'ENG-211',
      BLANK,
      BLANK
    ],
    Saturday: [
      BLANK,
      BLANK,
      BLANK,
      BLANK,
      'BIO-211 / EL-LAB',
      'HIN-102 / MAR-224 / EL-LAB',
      'PHY-211',
      'MATHS-211',
      'MATHS-211',
      'ENG-211',
      BLANK
    ]
  },

  'Division III': {
    Monday: [
      BLANK,
      BLANK,
      BLANK,
      BLANK,
      'MATHS-102',
      'CHEM-224',
      'BIO-224',
      'GEO-224',
      'ENG-224',
      'HPE-224',
      'HPE-224'
    ],
    Tuesday: [
      'C1 & C2: PHYSICS PR / C3 & C4: CHEMISTRY PR',
      'C1 & C2: PHYSICS PR / C3 & C4: CHEMISTRY PR',
      'C1 & C2: PHYSICS PR / C3 & C4: CHEMISTRY PR',
      'C1 & C2: PHYSICS PR / C3 & C4: CHEMISTRY PR',
      'PHY-224',
      'MATHS-102',
      'C4 & C3: PHYSICS PR / C2 & C1: CHEMISTRY PR',
      'C4 & C3: PHYSICS PR / C2 & C1: CHEMISTRY PR',
      'C4 & C3: PHYSICS PR / C2 & C1: CHEMISTRY PR',
      'C4 & C3: PHYSICS PR / C2 & C1: CHEMISTRY PR',
      BLANK
    ],
    Wednesday: [
      'BIOLOGY PR',
      'BIOLOGY PR',
      'BIOLOGY PR',
      'BIOLOGY PR',
      'GEO-224',
      'HIN-102 / MAR-224',
      'CHEM-224',
      'ENG-224',
      'EVS-224',
      'EVS-224',
      BLANK
    ],
    Thursday: [
      BLANK,
      BLANK,
      BLANK,
      BLANK,
      'CHEM-211',
      'HIN-102 / MAR-224',
      'PHY-224',
      'BIO-224',
      'GEO-224',
      'MATHS-102',
      BLANK
    ],
    Friday: [
      'GEO PR-224',
      'GEO PR-224',
      'GEO PR-224',
      'GEO PR-224',
      'PHY-224',
      'HIN-102 / MAR-224',
      'BIO-224',
      'MATHS-102',
      'CHEM-224',
      'ENG-224',
      BLANK
    ],
    Saturday: [
      'MATHS PR-224',
      'MATHS PR-224',
      'MATHS PR-224',
      'MATHS PR-224',
      'PHY-224',
      'HIN-102 / MAR-224',
      'CHEM-224',
      'BIO-224',
      'GEO-224',
      'ENG-224',
      BLANK
    ]
  }
};
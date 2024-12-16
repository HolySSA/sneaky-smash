let NEXUS_ID_COUNTER = 1;

const generateNexusId = () => {
  return NEXUS_ID_COUNTER++;
};

export default generateNexusId;

const q = (id, type, text, extra = {}) => ({
  id,
  type,
  text,
  ...extra,
})

const enhi = (en, hi) => ({ en, hi })

export const CHIEF_COMPLAINT_QUESTION = q(
  'chiefComplaint',
  'COMPLAINT',
  enhi('What brings you to the hospital today?', 'आज आप अस्पताल क्यों आए हैं?'),
  {
    section: 'chiefComplaint',
    field: 'chiefComplaint',
    explanation: enhi(
      'Choose a common reason or type your own.',
      'कोई आम कारण चुनें या अपना कारण लिखें।',
    ),
    required: true,
  },
)

export const PATHWAY_QUESTIONS = {
  chest_pain: [
    q('cp_onset', 'DURATION', enhi('When did the pain start?', 'दर्द कब शुरू हुआ?'), {
      section: 'hpi',
      field: 'onset',
    }),
    q('cp_location', 'SINGLE_SELECT', enhi('Where exactly do you feel the pain?', 'दर्द ठीक कहाँ महसूस होता है?'), {
      section: 'hpi',
      field: 'location',
      options: [
        enhi('Centre of the chest', 'सीने के बीच में'),
        enhi('Left side of chest', 'सीने की बाईं ओर'),
        enhi('Right side of chest', 'सीने की दाईं ओर'),
        enhi('Upper abdomen', 'पेट के ऊपरी भाग में'),
        enhi('Not sure', 'पता नहीं'),
      ],
    }),
    q('cp_character', 'SINGLE_SELECT', enhi('What does the pain feel like?', 'दर्द कैसा लगता है?'), {
      section: 'hpi',
      field: 'character',
      options: [
        enhi('Tight / Pressure', 'जकड़न / दबाव'),
        enhi('Sharp', 'तेज चुभन'),
        enhi('Burning', 'जलन'),
        enhi('Dull ache', 'हल्का दर्द'),
        enhi('Not sure', 'पता नहीं'),
      ],
    }),
    q('cp_spread', 'SINGLE_SELECT', enhi('Does the pain spread anywhere?', 'क्या दर्द कहीं फैलता है?'), {
      section: 'hpi',
      field: 'radiation',
      options: [
        enhi('No', 'नहीं'),
        enhi('Left arm', 'बाईं बांह'),
        enhi('Right arm', 'दाईं बांह'),
        enhi('Jaw / neck', 'जबड़ा / गर्दन'),
        enhi('Back', 'पीठ'),
      ],
    }),
    q('cp_severity', 'PAIN_SCALE', enhi('How severe is the pain from 0–10?', 'दर्द 0 से 10 में कितना तेज है?'), {
      section: 'hpi',
      field: 'severity',
    }),
    q('cp_worse', 'MULTI_SELECT', enhi('What makes it worse?', 'किससे दर्द बढ़ता है?'), {
      section: 'hpi',
      field: 'worse',
      options: [
        enhi('Walking / exertion', 'चलने / मेहनत से'),
        enhi('Rest', 'आराम से'),
        enhi('Breathing deeply', 'गहरी साँस लेने से'),
        enhi('Eating', 'खाने से'),
        enhi('Nothing specific', 'कुछ खास नहीं'),
      ],
    }),
    q('cp_better', 'MULTI_SELECT', enhi('What makes it better?', 'किससे दर्द कम होता है?'), {
      section: 'hpi',
      field: 'better',
      options: [
        enhi('Rest', 'आराम'),
        enhi('Sitting forward', 'आगे झुककर बैठना'),
        enhi('Medicine', 'दवाई'),
        enhi('Nothing helps', 'कुछ फायदा नहीं'),
      ],
    }),
    q('cp_breathing', 'YES_NO', enhi('Do you have difficulty breathing?', 'क्या साँस लेने में तकलीफ है?'), {
      section: 'hpi',
      field: 'dyspnoea',
    }),
    q('cp_sweating', 'YES_NO', enhi('Do you have sweating?', 'क्या पसीना आ रहा है?'), {
      section: 'hpi',
      field: 'sweating',
    }),
    q('cp_nausea', 'YES_NO', enhi('Do you have nausea or vomiting?', 'क्या मिचली या उल्टी है?'), {
      section: 'hpi',
      field: 'nausea',
    }),
    q('cp_before', 'YES_NO', enhi('Have you experienced this before?', 'क्या पहले भी ऐसा हुआ है?'), {
      section: 'hpi',
      field: 'priorEpisode',
    }),
  ],
  fever: [
    q('fe_onset', 'DURATION', enhi('When did the fever start?', 'बुखार कब शुरू हुआ?'), { section: 'hpi', field: 'onset' }),
    q('fe_pattern', 'SINGLE_SELECT', enhi('Is it continuous or comes and goes?', 'क्या बुखार लगातार है या आता-जाता है?'), {
      section: 'hpi',
      field: 'pattern',
      options: [enhi('Continuous', 'लगातार'), enhi('Comes and goes', 'आता-जाता है'), enhi('Not sure', 'पता नहीं')],
    }),
    q('fe_measured', 'YES_NO', enhi('Have you measured your temperature?', 'क्या आपने तापमान मापा है?'), {
      section: 'hpi',
      field: 'measured',
    }),
    q('fe_highest', 'TEXT', enhi('What was the highest temperature?', 'सबसे अधिक तापमान कितना था?'), {
      section: 'hpi',
      field: 'highestTemp',
      explanation: enhi('If you did not measure, type “not measured”.', 'अगर नहीं मापा, “मापा नहीं” लिखें।'),
    }),
    q('fe_chills', 'YES_NO', enhi('Do you have chills?', 'क्या कंपकंपी है?'), { section: 'hpi', field: 'chills' }),
    q('fe_sweating', 'YES_NO', enhi('Do you have sweating?', 'क्या पसीना आ रहा है?'), { section: 'hpi', field: 'sweating' }),
    q('fe_cough', 'YES_NO', enhi('Do you have cough?', 'क्या खाँसी है?'), { section: 'hpi', field: 'cough' }),
    q('fe_vomiting', 'YES_NO', enhi('Do you have vomiting?', 'क्या उल्टी है?'), { section: 'hpi', field: 'vomiting' }),
    q('fe_diarrhea', 'YES_NO', enhi('Do you have diarrhea?', 'क्या दस्त हैं?'), { section: 'hpi', field: 'diarrhea' }),
    q('fe_medicine', 'YES_NO', enhi('Have you taken any medicine?', 'क्या कोई दवाई ली है?'), { section: 'hpi', field: 'tookMedicine' }),
  ],
  abdominal_pain: [
    q('ap_onset', 'DURATION', enhi('When did the pain start?', 'दर्द कब शुरू हुआ?'), { section: 'hpi', field: 'onset' }),
    q('ap_location', 'SINGLE_SELECT', enhi('Where exactly is the pain?', 'दर्द ठीक कहाँ है?'), {
      section: 'hpi',
      field: 'location',
      options: [
        enhi('Upper abdomen', 'ऊपरी पेट'),
        enhi('Around the navel', 'नाभि के आसपास'),
        enhi('Lower right', 'नीचे दाईं ओर'),
        enhi('Lower left', 'नीचे बाईं ओर'),
        enhi('All over', 'पूरे पेट में'),
      ],
    }),
    q('ap_pattern', 'SINGLE_SELECT', enhi('Is it constant or intermittent?', 'क्या दर्द लगातार है या रुक-रुक कर आता है?'), {
      section: 'hpi',
      field: 'pattern',
      options: [enhi('Constant', 'लगातार'), enhi('Intermittent', 'रुक-रुक कर'), enhi('Not sure', 'पता नहीं')],
    }),
    q('ap_character', 'SINGLE_SELECT', enhi('What does it feel like?', 'कैसा लगता है?'), {
      section: 'hpi',
      field: 'character',
      options: [enhi('Cramping', 'ऐंठन'), enhi('Sharp', 'तेज'), enhi('Dull', 'हल्का'), enhi('Burning', 'जलन')],
    }),
    q('ap_severity', 'PAIN_SCALE', enhi('How severe is it from 0–10?', 'दर्द 0 से 10 में कितना तेज है?'), {
      section: 'hpi',
      field: 'severity',
    }),
    q('ap_move', 'YES_NO', enhi('Does it move anywhere?', 'क्या दर्द कहीं जाता है?'), { section: 'hpi', field: 'radiation' }),
    q('ap_eating', 'SINGLE_SELECT', enhi('Does eating affect it?', 'क्या खाने से असर पड़ता है?'), {
      section: 'hpi',
      field: 'eating',
      options: [enhi('Worse after eating', 'खाने के बाद बढ़ता है'), enhi('Better after eating', 'खाने के बाद कम होता है'), enhi('No change', 'कोई फर्क नहीं')],
    }),
    q('ap_vomiting', 'YES_NO', enhi('Any vomiting?', 'क्या उल्टी है?'), { section: 'hpi', field: 'vomiting' }),
    q('ap_diarrhea', 'YES_NO', enhi('Any diarrhea?', 'क्या दस्त हैं?'), { section: 'hpi', field: 'diarrhea' }),
    q('ap_constipation', 'YES_NO', enhi('Any constipation?', 'क्या कब्ज है?'), { section: 'hpi', field: 'constipation' }),
    q('ap_blood', 'YES_NO', enhi('Any blood in stool?', 'क्या मल में खून है?'), { section: 'hpi', field: 'bloodInStool' }),
    q('ap_before', 'YES_NO', enhi('Have you had this before?', 'क्या पहले भी ऐसा हुआ है?'), { section: 'hpi', field: 'priorEpisode' }),
  ],
  headache: [
    q('ha_onset', 'DURATION', enhi('When did the headache start?', 'सिर दर्द कब शुरू हुआ?'), { section: 'hpi', field: 'onset' }),
    q('ha_location', 'SINGLE_SELECT', enhi('Where is the pain?', 'दर्द कहाँ है?'), {
      section: 'hpi',
      field: 'location',
      options: [enhi('Whole head', 'पूरे सिर में'), enhi('One side', 'एक तरफ'), enhi('Forehead', 'माथे में'), enhi('Back of head', 'सिर के पीछे')],
    }),
    q('ha_severity', 'PAIN_SCALE', enhi('How severe is it from 0–10?', 'दर्द 0 से 10 में कितना तेज है?'), {
      section: 'hpi',
      field: 'severity',
    }),
    q('ha_pattern', 'SINGLE_SELECT', enhi('Is it constant or intermittent?', 'क्या दर्द लगातार है या रुक-रुक कर आता है?'), {
      section: 'hpi',
      field: 'pattern',
      options: [enhi('Constant', 'लगातार'), enhi('Intermittent', 'रुक-रुक कर')],
    }),
    q('ha_nausea', 'YES_NO', enhi('Any nausea or vomiting?', 'क्या मिचली या उल्टी है?'), { section: 'hpi', field: 'nausea' }),
    q('ha_light', 'YES_NO', enhi('Any sensitivity to light?', 'क्या रोशनी से तकलीफ है?'), { section: 'hpi', field: 'photophobia' }),
    q('ha_vision', 'YES_NO', enhi('Any visual changes?', 'क्या देखने में कोई बदलाव है?'), { section: 'hpi', field: 'visualChanges' }),
    q('ha_weakness', 'YES_NO', enhi('Any weakness or numbness?', 'क्या कमजोरी या सुन्नपन है?'), { section: 'hpi', field: 'weakness' }),
    q('ha_speech', 'YES_NO', enhi('Any difficulty speaking?', 'क्या बोलने में तकलीफ है?'), { section: 'hpi', field: 'speech' }),
    q('ha_before', 'YES_NO', enhi('Have you experienced this before?', 'क्या पहले भी ऐसा हुआ है?'), { section: 'hpi', field: 'priorEpisode' }),
  ],
  cough: [
    q('co_onset', 'DURATION', enhi('When did the cough start?', 'खाँसी कब शुरू हुई?'), { section: 'hpi', field: 'onset' }),
    q('co_type', 'SINGLE_SELECT', enhi('Is it dry or with mucus?', 'सूखी है या बलगम के साथ?'), {
      section: 'hpi',
      field: 'type',
      options: [enhi('Dry', 'सूखी'), enhi('With mucus', 'बलगम के साथ')],
    }),
    q('co_color', 'SINGLE_SELECT', enhi('What color is the mucus?', 'बलगम का रंग क्या है?'), {
      section: 'hpi',
      field: 'mucusColor',
      options: [enhi('No mucus', 'बलगम नहीं'), enhi('Clear / white', 'सफेद / साफ'), enhi('Yellow / green', 'पीला / हरा'), enhi('Not sure', 'पता नहीं')],
    }),
    q('co_fever', 'YES_NO', enhi('Do you have fever?', 'क्या बुखार है?'), { section: 'hpi', field: 'fever' }),
    q('co_breathing', 'YES_NO', enhi('Do you have difficulty breathing?', 'क्या साँस लेने में तकलीफ है?'), { section: 'hpi', field: 'dyspnoea' }),
    q('co_chest', 'YES_NO', enhi('Do you have chest pain?', 'क्या सीने में दर्द है?'), { section: 'hpi', field: 'chestPain' }),
    q('co_blood', 'YES_NO', enhi('Have you noticed blood in the mucus?', 'क्या बलगम में खून दिखा?'), { section: 'hpi', field: 'hemoptysis' }),
    q('co_before', 'YES_NO', enhi('Have you had this before?', 'क्या पहले भी ऐसा हुआ है?'), { section: 'hpi', field: 'priorEpisode' }),
  ],
  breathlessness: [
    q('br_onset', 'DURATION', enhi('When did the breathing difficulty start?', 'साँस की तकलीफ कब शुरू हुई?'), { section: 'hpi', field: 'onset' }),
    q('br_pattern', 'SINGLE_SELECT', enhi('Is it constant or intermittent?', 'क्या लगातार है या रुक-रुक कर आती है?'), {
      section: 'hpi',
      field: 'pattern',
      options: [enhi('Constant', 'लगातार'), enhi('Intermittent', 'रुक-रुक कर')],
    }),
    q('br_when', 'SINGLE_SELECT', enhi('Does it happen at rest or during activity?', 'आराम में होती है या काम करते समय?'), {
      section: 'hpi',
      field: 'context',
      options: [enhi('At rest', 'आराम में'), enhi('During activity', 'काम करते समय'), enhi('Both', 'दोनों')],
    }),
    q('br_severity', 'SINGLE_SELECT', enhi('How severe is it?', 'कितनी तेज है?'), {
      section: 'hpi',
      field: 'severity',
      options: [enhi('Mild', 'हल्की'), enhi('Moderate', 'मध्यम'), enhi('Severe', 'तेज')],
    }),
    q('br_chest', 'YES_NO', enhi('Do you have chest pain?', 'क्या सीने में दर्द है?'), { section: 'hpi', field: 'chestPain' }),
    q('br_cough', 'YES_NO', enhi('Do you have cough?', 'क्या खाँसी है?'), { section: 'hpi', field: 'cough' }),
    q('br_fever', 'YES_NO', enhi('Do you have fever?', 'क्या बुखार है?'), { section: 'hpi', field: 'fever' }),
    q('br_before', 'YES_NO', enhi('Have you experienced this before?', 'क्या पहले भी ऐसा हुआ है?'), { section: 'hpi', field: 'priorEpisode' }),
  ],
  vomiting: [
    q('vo_onset', 'DURATION', enhi('When did vomiting start?', 'उल्टी कब शुरू हुई?'), { section: 'hpi', field: 'onset' }),
    q('vo_times', 'NUMBER', enhi('How many times have you vomited?', 'कितनी बार उल्टी हुई?'), { section: 'hpi', field: 'times' }),
    q('vo_look', 'SINGLE_SELECT', enhi('What does the vomit look like?', 'उल्टी कैसी दिखती है?'), {
      section: 'hpi',
      field: 'appearance',
      options: [enhi('Food / liquid', 'खाना / तरल'), enhi('Yellow / green', 'पीली / हरी'), enhi('Not sure', 'पता नहीं')],
    }),
    q('vo_blood', 'YES_NO', enhi('Any blood?', 'क्या खून है?'), { section: 'hpi', field: 'blood' }),
    q('vo_pain', 'YES_NO', enhi('Any abdominal pain?', 'क्या पेट दर्द है?'), { section: 'hpi', field: 'abdominalPain' }),
    q('vo_fever', 'YES_NO', enhi('Any fever?', 'क्या बुखार है?'), { section: 'hpi', field: 'fever' }),
    q('vo_diarrhea', 'YES_NO', enhi('Any diarrhea?', 'क्या दस्त हैं?'), { section: 'hpi', field: 'diarrhea' }),
    q('vo_fluids', 'YES_NO', enhi('Are you able to drink fluids?', 'क्या पानी पी पा रहे हैं?'), { section: 'hpi', field: 'canDrink' }),
    q('vo_before', 'YES_NO', enhi('Have you experienced this before?', 'क्या पहले भी ऐसा हुआ है?'), { section: 'hpi', field: 'priorEpisode' }),
  ],
  back_pain: [
    q('bp_onset', 'DURATION', enhi('When did the pain start?', 'दर्द कब शुरू हुआ?'), { section: 'hpi', field: 'onset' }),
    q('bp_location', 'SINGLE_SELECT', enhi('Where exactly is the pain?', 'दर्द ठीक कहाँ है?'), {
      section: 'hpi',
      field: 'location',
      options: [enhi('Upper back', 'ऊपरी पीठ'), enhi('Lower back', 'निचली कमर'), enhi('One side', 'एक तरफ'), enhi('Whole back', 'पूरी पीठ')],
    }),
    q('bp_severity', 'PAIN_SCALE', enhi('How severe is it from 0–10?', 'दर्द 0 से 10 में कितना तेज है?'), {
      section: 'hpi',
      field: 'severity',
    }),
    q('bp_legs', 'YES_NO', enhi('Does the pain spread to your legs?', 'क्या दर्द पैरों तक जाता है?'), { section: 'hpi', field: 'radiation' }),
    q('bp_numbness', 'YES_NO', enhi('Any numbness?', 'क्या सुन्नपन है?'), { section: 'hpi', field: 'numbness' }),
    q('bp_weakness', 'YES_NO', enhi('Any weakness?', 'क्या कमजोरी है?'), { section: 'hpi', field: 'weakness' }),
    q('bp_walking', 'YES_NO', enhi('Any difficulty walking?', 'क्या चलने में तकलीफ है?'), { section: 'hpi', field: 'walking' }),
    q('bp_bladder', 'YES_NO', enhi('Any bladder or bowel changes?', 'क्या पेशाब या शौच में बदलाव है?'), { section: 'hpi', field: 'bladderBowel' }),
    q('bp_injury', 'YES_NO', enhi('Any recent injury?', 'क्या हाल में चोट लगी है?'), { section: 'hpi', field: 'injury' }),
    q('bp_before', 'YES_NO', enhi('Have you experienced this before?', 'क्या पहले भी ऐसा हुआ है?'), { section: 'hpi', field: 'priorEpisode' }),
  ],
  other: [
    q('ot_describe', 'TEXT', enhi('Please describe your main problem.', 'कृपया अपनी मुख्य समस्या बताएँ।'), {
      section: 'hpi',
      field: 'description',
    }),
    q('ot_onset', 'DURATION', enhi('When did this start?', 'यह कब शुरू हुआ?'), { section: 'hpi', field: 'onset' }),
    q('ot_severity', 'SINGLE_SELECT', enhi('How severe is it?', 'यह कितना गंभीर है?'), {
      section: 'hpi',
      field: 'severity',
      options: [enhi('Mild', 'हल्का'), enhi('Moderate', 'मध्यम'), enhi('Severe', 'तेज')],
    }),
    q('ot_before', 'YES_NO', enhi('Have you experienced this before?', 'क्या पहले भी ऐसा हुआ है?'), { section: 'hpi', field: 'priorEpisode' }),
  ],
}

export const GENERAL_HISTORY_QUESTIONS = [
  q(
    'pmh',
    'MULTI_SELECT',
    enhi('Do you have any existing medical conditions?', 'क्या आपको कोई पुरानी बीमारी है?'),
    {
      section: 'pastMedicalHistory',
      field: 'conditions',
      heading: enhi('Past medical history', 'पुराना मेडिकल इतिहास'),
      options: [
        enhi('Diabetes', 'मधुमेह'),
        enhi('High Blood Pressure', 'उच्च रक्तचाप'),
        enhi('Heart Disease', 'हृदय रोग'),
        enhi('Asthma', 'दमा'),
        enhi('Kidney Disease', 'गुर्दे की बीमारी'),
        enhi('Liver Disease', 'लिवर की बीमारी'),
        enhi('None', 'कोई नहीं'),
        enhi('Other', 'अन्य'),
      ],
    },
  ),
  q('surgery_has', 'YES_NO', enhi('Have you had any previous surgeries?', 'क्या पहले कोई सर्जरी हुई है?'), {
    section: 'pastSurgicalHistory',
    field: 'has',
    heading: enhi('Past surgical history', 'पुरानी सर्जरी'),
  }),
  q('surgery_details', 'TEXT', enhi('Please share details of the surgery.', 'सर्जरी का विवरण बताएँ।'), {
    section: 'pastSurgicalHistory',
    field: 'details',
    showIf: { id: 'surgery_has', value: 'Yes' },
  }),
  q('meds_has', 'YES_NO', enhi('Are you currently taking any medicines?', 'क्या आप अभी कोई दवा ले रहे हैं?'), {
    section: 'medications',
    field: 'has',
    heading: enhi('Medications', 'दवाइयाँ'),
  }),
  q('meds_details', 'TEXT', enhi('Please list the medicines.', 'कृपया दवाइयों के नाम लिखें।'), {
    section: 'medications',
    field: 'details',
    showIf: { id: 'meds_has', value: 'Yes' },
  }),
  q('allergy_has', 'YES_NO', enhi('Do you have any known allergies?', 'क्या आपको कोई एलर्जी है?'), {
    section: 'allergies',
    field: 'has',
    heading: enhi('Allergies', 'एलर्जी'),
  }),
  q('allergy_details', 'TEXT', enhi('Please list the allergies.', 'कृपया एलर्जी लिखें।'), {
    section: 'allergies',
    field: 'details',
    showIf: { id: 'allergy_has', value: 'Yes' },
  }),
  q(
    'family_has',
    'YES_NO',
    enhi('Does anyone in your immediate family have any major medical conditions?', 'क्या परिवार में किसी को बड़ी बीमारी है?'),
    {
      section: 'familyHistory',
      field: 'has',
      heading: enhi('Family history', 'पारिवारिक इतिहास'),
    },
  ),
  q('family_details', 'TEXT', enhi('Please share family medical details.', 'पारिवारिक बीमारी का विवरण बताएँ।'), {
    section: 'familyHistory',
    field: 'details',
    showIf: { id: 'family_has', value: 'Yes' },
  }),
  q('smoke', 'SINGLE_SELECT', enhi('Do you smoke?', 'क्या आप धूम्रपान करते हैं?'), {
    section: 'personalHistory',
    field: 'smoking',
    heading: enhi('Personal history', 'व्यक्तिगत इतिहास'),
    options: [enhi('No', 'नहीं'), enhi('Yes', 'हाँ'), enhi('Used to', 'पहले करते थे')],
  }),
  q('alcohol', 'SINGLE_SELECT', enhi('Do you drink alcohol?', 'क्या आप शराब पीते हैं?'), {
    section: 'personalHistory',
    field: 'alcohol',
    options: [enhi('No', 'नहीं'), enhi('Occasional', 'कभी-कभी'), enhi('Regular', 'नियमित')],
  }),
  q('occupation', 'TEXT', enhi('What is your occupation?', 'आपका काम क्या है?'), {
    section: 'personalHistory',
    field: 'occupation',
  }),
  q('diet', 'SINGLE_SELECT', enhi('What is your usual diet?', 'आपका सामान्य आहार क्या है?'), {
    section: 'personalHistory',
    field: 'diet',
    options: [enhi('Vegetarian', 'शाकाहारी'), enhi('Mixed', 'मिश्रित'), enhi('Other', 'अन्य')],
  }),
  q('ros_fever', 'YES_NO', enhi('Any fever now?', 'अभी बुखार है?'), {
    section: 'reviewOfSystems',
    field: 'fever',
    heading: enhi('Review of systems', 'अन्य लक्षण'),
  }),
  q('ros_weakness', 'YES_NO', enhi('Any unusual weakness?', 'कोई असामान्य कमजोरी है?'), {
    section: 'reviewOfSystems',
    field: 'weakness',
  }),
  q('ros_weight', 'YES_NO', enhi('Any recent weight change?', 'हाल में वजन में बदलाव है?'), {
    section: 'reviewOfSystems',
    field: 'weightChange',
  }),
  q('ros_faint', 'YES_NO', enhi('Did you faint or lose consciousness?', 'क्या आप बेहोश हुए या गिर गए?'), {
    section: 'reviewOfSystems',
    field: 'lossOfConsciousness',
  }),
]

export const DURATION_OPTIONS = [
  enhi('Since today', 'आज से'),
  enhi('Since yesterday', 'कल से'),
  enhi('For a few days', 'कुछ दिनों से'),
  enhi('For a week', 'एक सप्ताह से'),
  enhi('For more than a week', 'एक सप्ताह से अधिक'),
  enhi('For months', 'कई महीनों से'),
]

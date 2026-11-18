const clinic = require('./clinic');

const rows = [
  ['Where is the clinic in Karaikudi?', clinic.name + ' is at ' + clinic.address + '. The clinic is opposite Jeyakumaran Furniture. Use the full address or the clinic map when planning your visit.',
    'காரைக்குடியில் பல் மருத்துவமனை எங்கு உள்ளது?', 'எண் 315/24, எம்.ஏ.எம். கட்டிடம், செக்காலை, காரைக்குடி 630001. மருத்துவமனை ஜெயகுமரன் ஃபர்னிச்சர் கடைக்கு எதிரில் உள்ளது.'],
  ['What are the clinic hours?', clinic.name + ' in Karaikudi sees patients from 9:30 AM to 9:00 PM Monday through Saturday. Sunday visits are by appointment only. Call or WhatsApp the front desk before travelling for a Sunday appointment.',
    'மருத்துவமனை திறந்திருக்கும் நேரம் என்ன?', 'திங்கள் முதல் சனி வரை காலை 9:30 முதல் இரவு 9:00 வரை திறந்திருக்கும். ஞாயிற்றுக்கிழமை முன்பதிவு செய்தால் மட்டுமே வரலாம்.'],
  ['How do I book an appointment?', 'To book a visit at ' + clinic.name + ' in Karaikudi, call or WhatsApp ' + clinic.phone + '. Tell the front desk your preferred day and whether you are booking for an adult or a child.',
    'சந்திப்புக்கு எப்படி முன்பதிவு செய்வது?', 'முன்பதிவு செய்ய ' + clinic.phone + ' என்ற எண்ணை அழைக்கவும் அல்லது வாட்ஸ்அப்பில் தொடர்புகொள்ளவும். உங்களுக்கு வசதியான நாளைக் குறிப்பிடுங்கள்.'],
  ['Can I ask about parking before my visit?', 'Call ' + clinic.name + ' in Karaikudi on ' + clinic.phone + ' to ask about parking before you travel. Give the front desk the day and approximate time of your visit so it can advise you.',
    'வாகனம் நிறுத்தும் வசதி பற்றி எப்படித் தெரிந்துகொள்வது?', 'வருவதற்கு முன்பு ' + clinic.phone + ' என்ற எண்ணில் அழைத்து வாகனம் நிறுத்தும் வசதி பற்றிக் கேளுங்கள்.'],
  ['Can I request my preferred language?', 'When booking with ' + clinic.name + ' in Karaikudi, tell the front desk which language you prefer. Call or WhatsApp ' + clinic.phone + ' to ask whether your preferred language can be accommodated at the appointment.',
    'எனக்கு வசதியான மொழியில் பேச முடியுமா?', 'முன்பதிவு செய்யும்போது உங்களுக்கு வசதியான மொழியைத் தெரிவியுங்கள். அந்த மொழியில் பேச முடியுமா என்பதை ' + clinic.phone + ' என்ற எண்ணில் கேட்டுத் தெரிந்துகொள்ளுங்கள்.'],
  ['Is a digital X-ray free on the first visit?', 'When the dentist recommends a digital X-ray on your first visit, ' + clinic.name + ' in Karaikudi offers that X-ray free. Ask the front desk how the first-visit offer applies when you arrange your appointment.',
    'முதல் வருகையில் டிஜிட்டல் எக்ஸ்-ரே இலவசமா?', 'முதல் வருகையில் பல் மருத்துவர் பரிந்துரைத்தால் டிஜிட்டல் எக்ஸ்-ரே இலவசம். முன்பதிவு செய்யும்போது இதைப் பற்றிக் கேட்டுத் தெரிந்துகொள்ளுங்கள்.'],
  ['Can I book an appointment for my child?', clinic.name + ' in Karaikudi lists pedodontics among its services. Call or WhatsApp ' + clinic.phone + ' to book a child’s visit. Tell the front desk you are booking for a child so it can guide you.',
    'குழந்தைக்கு பல் மருத்துவச் சந்திப்பை முன்பதிவு செய்யலாமா?', 'குழந்தைகளுக்கான பல் மருத்துவச் சேவை உள்ளது. முன்பதிவு செய்ய ' + clinic.phone + ' என்ற எண்ணை அழைக்கவும் அல்லது வாட்ஸ்அப்பில் தொடர்புகொள்ளவும்.'],
  ['What should I bring to my appointment?', 'Before visiting ' + clinic.name + ' in Karaikudi, ask the front desk what to bring for your appointment. If you have earlier dental reports or X-rays, mention them when you call so the team can advise you.',
    'சந்திப்புக்கு என்ன கொண்டு வர வேண்டும்?', 'வருவதற்கு முன்பு என்ன கொண்டு வர வேண்டும் என்று மருத்துவமனையிடம் கேளுங்கள். ஏற்கெனவே பல் மருத்துவ அறிக்கைகள் அல்லது எக்ஸ்-ரே இருந்தால், அழைக்கும்போது தெரிவியுங்கள்.'],
];

module.exports = rows.flatMap(([question, answer, tamilQuestion, tamilAnswer]) => [
  { question, answer, language: 'en' },
  { question:tamilQuestion, answer:tamilAnswer, language:'ta' },
]);

// हिंदी | English | Hinglish   (~ = Hinglish वही जो English)
const RAW = `
चंदा देखना|View donations|Chanda dekhna
चंदा जोड़ना|Add donations|Chanda jodna
खर्च देखना|View expenses|Kharch dekhna
खर्च जोड़ना|Add expenses|Kharch jodna
एंट्री रद्द करना|Cancel entries|Entry cancel karna
रिकॉर्ड देखना|View records|Record dekhna
पंडाल|Pandal|~
मूर्ति|Idol|Murti
भोग/प्रसाद|Bhog / Prasad|~
लाइट/सजावट|Lights / Decoration|Light / Sajawat
पुजारी/दक्षिणा|Priest / Dakshina|Pujari / Dakshina
साउंड/डीजे|Sound / DJ|~
विसर्जन|Immersion|Visarjan
अन्य|Other|Anya
नकद|Cash|~
बैंक|Bank|~
नहीं लिखा|Not entered|Nahi likha
हिसाब|Accounts|Hisaab
चंदा|Donations|Chanda
खर्च|Expenses|Kharch
रिकॉर्ड|Records|Record
समिति के सदस्य|Committee members|Samiti ke sadasya
यूज़र|Users|~
सेटिंग|Settings|Setting
होम|Home|~
मैनेज|Manage|~
बंद करें|Close|Band karo
लॉगआउट|Logout|~
साल|Year|Saal
यूज़रनेम|Username|~
पासवर्ड|Password|~
लॉगिन करें|Log in|Login karo
यूज़रनेम या पासवर्ड गलत है|Wrong username or password|Username ya password galat hai
दुर्गा पूजा का पूरा हिसाब|Complete accounts of Durga Puja|Durga Puja ka poora hisaab
खुल रहा है…|Loading…|Khul raha hai…
बचा हुआ पैसा|Balance left|Bacha hua paisa
रसीद|receipts|rasid
एंट्री|entries|entry
आज का चंदा|Today's collection|Aaj ka chanda
श्रेणी के अनुसार खर्च|Expenses by category|Kharch category ke hisaab se
अभी कोई खर्च नहीं जोड़ा गया|No expenses added yet|Abhi koi kharch nahi joda
किसने कितना चंदा जमा किया|Who collected how much|Kisne kitna chanda jama kiya
हिस्सा|share|hissa
अभी कोई चंदा नहीं जोड़ा गया|No donations added yet|Abhi koi chanda nahi joda
गाँव के अनुसार चंदा|Donations by village|Gaon ke hisaab se chanda
प्रिंट / PDF|Print / PDF|~
चंदा CSV|Donations CSV|Chanda CSV
खर्च CSV|Expenses CSV|Kharch CSV
एक्सपोर्ट करने के लिए कोई एंट्री नहीं है|No entries to export|Export karne ke liye koi entry nahi hai
पूरा लेखा-जोखा|Full summary|Poora hisaab
कुल|Total|Kul
चंदा देने वाले का नाम|Donor's name|Chanda dene wale ka naam
गाँव / मोहल्ले का नाम|Village / locality|Gaon / mohalle ka naam
राशि (₹)|Amount (₹)|Rakam (₹)
फ़ोन नंबर|Phone number|~
चंदा किसने लिया (अपने आप भरा, बदला नहीं जा सकता)|Collected by (auto-filled, cannot be changed)|Chanda kisne liya (apne aap bhara, badla nahi ja sakta)
नोट (वैकल्पिक)|Note (optional)|~
चंदा जोड़ें|Add donation|Chanda jodo
रद्द करें|Cancel|Cancel karo
रद्द|Cancelled|Cancel
सेव करें|Save|Save karo
रद्द करने का कारण लिखें (कम से कम 5 अक्षर):|Reason for cancelling (min 5 characters):|Cancel karne ka kaaran likho (kam se kam 5 akshar):
WhatsApp रसीद|WhatsApp receipt|WhatsApp rasid
किस चीज़ का खर्च|What was it for|Kis cheez ka kharch
किसको दिया (दुकान)|Paid to (shop)|Kisko diya (dukaan)
बिल नंबर|Bill number|~
खर्च किसने किया (अपने आप भरा)|Spent by (auto-filled)|Kharch kisne kiya (apne aap bhara)
बिल की फ़ोटो|Bill photo|Bill ki photo
खर्च जोड़ें|Add expense|Kharch jodo
बिल देखें|View bill|Bill dekho
बिल|Bill|~
बिल अपलोड नहीं हुआ|Bill upload failed|Bill upload nahi hua
किसने, कब, क्या किया: पूरा रिकॉर्ड|Who did what and when: full log|Kisne, kab, kya kiya: poora record
अभी कोई रिकॉर्ड नहीं|No records yet|Abhi koi record nahi
जोड़ा|Added|Joda
बदला / रद्द किया|Changed / cancelled|Badla / cancel kiya
यूज़र बनाया|User created|User banaya
यूज़र बदला|User changed|User badla
कौन क्या कर सकता है, यहाँ तय करें|Decide who can do what|Kaun kya kar sakta hai, yahan tay karo
नया यूज़र बनाएँ|Create new user|Naya user banao
पूरा नाम|Full name|Poora naam
पासवर्ड (कम से कम 6 अक्षर)|Password (min 6 characters)|Password (6+ akshar)
यूज़र बनाएँ|Create user|User banao
सभी यूज़र|All users|Sabhi users
यूज़र बंद करें|Deactivate|Band karo
यूज़र चालू करें|Activate|Chalu karo
पासवर्ड बदलें|Change password|Password badlo
नया पासवर्ड (कम से कम 6 अक्षर):|New password (min 6 characters):|Naya password (6+ akshar):
सुपरएडमिन|Superadmin|~
एडमिन|Admin|~
समिति का नाम, लोगो और फ़ोटो|Committee name, logo and photos|Samiti ka naam, logo aur photo
समिति की जानकारी|Committee details|Samiti ki jaankari
समिति का नाम|Committee name|Samiti ka naam
टैगलाइन (जैसे: जय माँ दुर्गा)|Tagline (e.g. Jai Maa Durga)|Tagline (jaise: Jai Maa Durga)
पूजा की तारीख|Puja dates|Puja ki tarikh
गाँव / पता|Village / address|Gaon / pata
फ़ोटो|Photos|Photo
समिति का लोगो (गोल दिखेगा)|Committee logo (shown round)|Samiti ka logo (gol dikhega)
दुर्गा जी की फ़ोटो (होम पेज के ऊपर)|Durga ji's photo (top of home page)|Durga ji ki photo (home page ke upar)
सेव हो गया|Saved|Save ho gaya
केपीएल दुर्गा पूजा समिति|KPL Durga Puja Samiti|~
⚙️ मैनेज → सेटिंग में जाकर लोगो और दुर्गा जी की फ़ोटो लगाएँ|⚙️ Go to Manage → Settings and add the logo and Durga ji's photo|⚙️ Manage → Setting me jaakar logo aur Durga ji ki photo lagao
सदस्यों की फ़ोटो, नाम और पद|Members' photos, names and roles|Sadasyon ki photo, naam aur pad
नया सदस्य जोड़ें|Add new member|Naya sadasya jodo
नाम|Name|Naam
पद (जैसे अध्यक्ष)|Role (e.g. President)|Pad (jaise Adhyaksh)
संरक्षक|Patron|Sanrakshak
अध्यक्ष|President|Adhyaksh
उपाध्यक्ष|Vice President|Upadhyaksh
सचिव|Secretary|Sachiv
कोषाध्यक्ष|Treasurer|Kosadhyaksh
सदस्य|Member|Sadasya
क्रम (1, 2, 3…)|Order (1, 2, 3…)|Kram (1, 2, 3…)
फ़ोटो बदलें|Change photo|Photo badlo
फ़ोटो चुनें|Choose photo|Photo chuno
सदस्य जोड़ें|Add member|Sadasya jodo
सभी सदस्य|All members|Sabhi sadasya
क्रम|Order|Kram
हटाएँ|Remove|Hatao
अभी कोई सदस्य नहीं जोड़ा गया|No members added yet|Abhi koi sadasya nahi joda
यह पेज सिर्फ़ सुपरएडमिन के लिए है|This page is for superadmin only|Ye page sirf superadmin ke liye hai
समिति से हटाएँ:|Remove from committee:|Samiti se hatao:
फ़ोटो सेट करें|Adjust photo|Photo set karo
फ़ोटो को उँगली से खिसकाएँ और नीचे स्लाइडर से बड़ा-छोटा करें। फ्रेम में जितना दिख रहा है, उतना ही सेव होगा।|Drag the photo with your finger and use the slider to zoom. Only what is inside the frame will be saved.|Photo ko ungli se khiskao aur neeche slider se bada-chhota karo. Frame me jitna dikh raha hai, utna hi save hoga.
ज़ूम|Zoom|~
`;
export const L: Record<string, [string, string]> = {};
RAW.trim().split('\n').forEach(l => { const [h, e, x] = l.split('|'); L[h] = [e, x === '~' ? e : x]; });

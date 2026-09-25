export interface IAll64District {
  division: string;
  divisionBn: string;
  district: string;
  districtBn: string;
  displayName: string;
  deliveryCharge: number;
  estimatedDelivery: string;
  isActive: boolean;
}

export const ALL_64_DISTRICTS: IAll64District[] = [
  // 1. ঢাকা বিভাগ (Dhaka Division - 13 Districts)
  { division: "Dhaka", divisionBn: "ঢাকা", district: "Dhaka", districtBn: "ঢাকা", displayName: "Dhaka (ঢাকা)", deliveryCharge: 60, estimatedDelivery: "24-48 Hours", isActive: true },
  { division: "Dhaka", divisionBn: "ঢাকা", district: "Gazipur", districtBn: "গাজীপুর", displayName: "Gazipur (গাজীপুর)", deliveryCharge: 100, estimatedDelivery: "48-72 Hours", isActive: true },
  { division: "Dhaka", divisionBn: "ঢাকা", district: "Narayanganj", districtBn: "নারায়ণগঞ্জ", displayName: "Narayanganj (নারায়ণগঞ্জ)", deliveryCharge: 100, estimatedDelivery: "48-72 Hours", isActive: true },
  { division: "Dhaka", divisionBn: "ঢাকা", district: "Tangail", districtBn: "টাঙ্গাইল", displayName: "Tangail (টাঙ্গাইল)", deliveryCharge: 120, estimatedDelivery: "2-3 Days", isActive: true },
  { division: "Dhaka", divisionBn: "ঢাকা", district: "Kishoreganj", districtBn: "কিশোরগঞ্জ", displayName: "Kishoreganj (কিশোরগঞ্জ)", deliveryCharge: 120, estimatedDelivery: "2-3 Days", isActive: true },
  { division: "Dhaka", divisionBn: "ঢাকা", district: "Manikganj", districtBn: "মানিকগঞ্জ", displayName: "Manikganj (মানিকগঞ্জ)", deliveryCharge: 120, estimatedDelivery: "2-3 Days", isActive: true },
  { division: "Dhaka", divisionBn: "ঢাকা", district: "Munshiganj", districtBn: "মুন্সীগঞ্জ", displayName: "Munshiganj (মুন্সীগঞ্জ)", deliveryCharge: 120, estimatedDelivery: "2-3 Days", isActive: true },
  { division: "Dhaka", divisionBn: "ঢাকা", district: "Narsingdi", districtBn: "নরসিংদী", displayName: "Narsingdi (নরসিংদী)", deliveryCharge: 120, estimatedDelivery: "2-3 Days", isActive: true },
  { division: "Dhaka", divisionBn: "ঢাকা", district: "Faridpur", districtBn: "ফরিদপুর", displayName: "Faridpur (ফরিদপুর)", deliveryCharge: 120, estimatedDelivery: "2-3 Days", isActive: true },
  { division: "Dhaka", divisionBn: "ঢাকা", district: "Gopalganj", districtBn: "গোপালগঞ্জ", displayName: "Gopalganj (গোপালগঞ্জ)", deliveryCharge: 120, estimatedDelivery: "2-3 Days", isActive: true },
  { division: "Dhaka", divisionBn: "ঢাকা", district: "Madaripur", districtBn: "মাদারীপুর", displayName: "Madaripur (মাদারীপুর)", deliveryCharge: 120, estimatedDelivery: "2-3 Days", isActive: true },
  { division: "Dhaka", divisionBn: "ঢাকা", district: "Rajbari", districtBn: "রাজবাড়ী", displayName: "Rajbari (রাজবাড়ী)", deliveryCharge: 120, estimatedDelivery: "2-3 Days", isActive: true },
  { division: "Dhaka", divisionBn: "ঢাকা", district: "Shariatpur", districtBn: "শরীয়তপুর", displayName: "Shariatpur (শরীয়তপুর)", deliveryCharge: 120, estimatedDelivery: "2-3 Days", isActive: true },

  // 2. চট্টগ্রাম বিভাগ (Chattogram Division - 11 Districts)
  { division: "Chattogram", divisionBn: "চট্টগ্রাম", district: "Chattogram", districtBn: "চট্টগ্রাম", displayName: "Chattogram (চট্টগ্রাম)", deliveryCharge: 120, estimatedDelivery: "2-3 Days", isActive: true },
  { division: "Chattogram", divisionBn: "চট্টগ্রাম", district: "Cox's Bazar", districtBn: "কক্সবাজার", displayName: "Cox's Bazar (কক্সবাজার)", deliveryCharge: 120, estimatedDelivery: "3-4 Days", isActive: true },
  { division: "Chattogram", divisionBn: "চট্টগ্রাম", district: "Cumilla", districtBn: "কুমিল্লা", displayName: "Cumilla (কুমিল্লা)", deliveryCharge: 120, estimatedDelivery: "2-3 Days", isActive: true },
  { division: "Chattogram", divisionBn: "চট্টগ্রাম", district: "Feni", districtBn: "ফেনী", displayName: "Feni (ফেনী)", deliveryCharge: 120, estimatedDelivery: "2-3 Days", isActive: true },
  { division: "Chattogram", divisionBn: "চট্টগ্রাম", district: "Brahmanbaria", districtBn: "ব্রাহ্মণবাড়িয়া", displayName: "Brahmanbaria (ব্রাহ্মণবাড়িয়া)", deliveryCharge: 120, estimatedDelivery: "2-3 Days", isActive: true },
  { division: "Chattogram", divisionBn: "চট্টগ্রাম", district: "Noakhali", districtBn: "নোয়াখালী", displayName: "Noakhali (নোয়াখালী)", deliveryCharge: 120, estimatedDelivery: "2-3 Days", isActive: true },
  { division: "Chattogram", divisionBn: "চট্টগ্রাম", district: "Chandpur", districtBn: "চাঁদপুর", displayName: "Chandpur (চাঁদপুর)", deliveryCharge: 120, estimatedDelivery: "2-3 Days", isActive: true },
  { division: "Chattogram", divisionBn: "চট্টগ্রাম", district: "Lakshmipur", districtBn: "লক্ষ্মীপুর", displayName: "Lakshmipur (লক্ষ্মীপুর)", deliveryCharge: 120, estimatedDelivery: "2-3 Days", isActive: true },
  { division: "Chattogram", divisionBn: "চট্টগ্রাম", district: "Rangamati", districtBn: "রাঙ্গামাটি", displayName: "Rangamati (রাঙ্গামাটি)", deliveryCharge: 120, estimatedDelivery: "3-4 Days", isActive: true },
  { division: "Chattogram", divisionBn: "চট্টগ্রাম", district: "Bandarban", districtBn: "বান্দরবান", displayName: "Bandarban (বান্দরবান)", deliveryCharge: 120, estimatedDelivery: "3-4 Days", isActive: true },
  { division: "Chattogram", divisionBn: "চট্টগ্রাম", district: "Khagrachhari", districtBn: "খাগড়াছড়ি", displayName: "Khagrachhari (খাগড়াছড়ি)", deliveryCharge: 120, estimatedDelivery: "3-4 Days", isActive: true },

  // 3. রাজশাহী বিভাগ (Rajshahi Division - 8 Districts)
  { division: "Rajshahi", divisionBn: "রাজশাহী", district: "Rajshahi", districtBn: "রাজশাহী", displayName: "Rajshahi (রাজশাহী)", deliveryCharge: 120, estimatedDelivery: "2-3 Days", isActive: true },
  { division: "Rajshahi", divisionBn: "রাজশাহী", district: "Bogura", districtBn: "বগুড়া", displayName: "Bogura (বগুড়া)", deliveryCharge: 120, estimatedDelivery: "2-3 Days", isActive: true },
  { division: "Rajshahi", divisionBn: "রাজশাহী", district: "Pabna", districtBn: "পাবনা", displayName: "Pabna (পাবনা)", deliveryCharge: 120, estimatedDelivery: "2-3 Days", isActive: true },
  { division: "Rajshahi", divisionBn: "রাজশাহী", district: "Sirajganj", districtBn: "সিরাজগঞ্জ", displayName: "Sirajganj (সিরাজগঞ্জ)", deliveryCharge: 120, estimatedDelivery: "2-3 Days", isActive: true },
  { division: "Rajshahi", divisionBn: "রাজশাহী", district: "Naogaon", districtBn: "নওগাঁ", displayName: "Naogaon (নওগাঁ)", deliveryCharge: 120, estimatedDelivery: "2-3 Days", isActive: true },
  { division: "Rajshahi", divisionBn: "রাজশাহী", district: "Natore", districtBn: "নাটোর", displayName: "Natore (নাটোর)", deliveryCharge: 120, estimatedDelivery: "2-3 Days", isActive: true },
  { division: "Rajshahi", divisionBn: "রাজশাহী", district: "Chapai Nawabganj", districtBn: "চাঁপাইনবাবগঞ্জ", displayName: "Chapai Nawabganj (চাঁপাইনবাবগঞ্জ)", deliveryCharge: 120, estimatedDelivery: "2-3 Days", isActive: true },
  { division: "Rajshahi", divisionBn: "রাজশাহী", district: "Joypurhat", districtBn: "জয়পুরহাট", displayName: "Joypurhat (জয়পুরহাট)", deliveryCharge: 120, estimatedDelivery: "2-3 Days", isActive: true },

  // 4. খুলনা বিভাগ (Khulna Division - 10 Districts)
  { division: "Khulna", divisionBn: "খুলনা", district: "Khulna", districtBn: "খুলনা", displayName: "Khulna (খুলনা)", deliveryCharge: 120, estimatedDelivery: "2-3 Days", isActive: true },
  { division: "Khulna", divisionBn: "খুলনা", district: "Jashore", districtBn: "যশোর", displayName: "Jashore (যশোর)", deliveryCharge: 120, estimatedDelivery: "2-3 Days", isActive: true },
  { division: "Khulna", divisionBn: "খুলনা", district: "Kushtia", districtBn: "কুষ্টিয়া", displayName: "Kushtia (কুষ্টিয়া)", deliveryCharge: 120, estimatedDelivery: "2-3 Days", isActive: true },
  { division: "Khulna", divisionBn: "খুলনা", district: "Jhenaidah", districtBn: "ঝিনাইদহ", displayName: "Jhenaidah (ঝিনাইদহ)", deliveryCharge: 120, estimatedDelivery: "2-3 Days", isActive: true },
  { division: "Khulna", divisionBn: "খুলনা", district: "Satkhira", districtBn: "সাতক্ষীরা", displayName: "Satkhira (সাতক্ষীরা)", deliveryCharge: 120, estimatedDelivery: "2-3 Days", isActive: true },
  { division: "Khulna", divisionBn: "খুলনা", district: "Bagerhat", districtBn: "বাগেরহাট", displayName: "Bagerhat (বাগেরহাট)", deliveryCharge: 120, estimatedDelivery: "2-3 Days", isActive: true },
  { division: "Khulna", divisionBn: "খুলনা", district: "Chuadanga", districtBn: "চুয়াডাঙ্গা", displayName: "Chuadanga (চুয়াডাঙ্গা)", deliveryCharge: 120, estimatedDelivery: "2-3 Days", isActive: true },
  { division: "Khulna", divisionBn: "খুলনা", district: "Meherpur", districtBn: "মেহেরপুর", displayName: "Meherpur (মেহেরপুর)", deliveryCharge: 120, estimatedDelivery: "2-3 Days", isActive: true },
  { division: "Khulna", divisionBn: "খুলনা", district: "Magura", districtBn: "মাগুরা", displayName: "Magura (মাগুরা)", deliveryCharge: 120, estimatedDelivery: "2-3 Days", isActive: true },
  { division: "Khulna", divisionBn: "খুলনা", district: "Narail", districtBn: "নড়াইল", displayName: "Narail (নড়াইল)", deliveryCharge: 120, estimatedDelivery: "2-3 Days", isActive: true },

  // 5. বরিশাল বিভাগ (Barishal Division - 6 Districts)
  { division: "Barishal", divisionBn: "বরিশাল", district: "Barishal", districtBn: "বরিশাল", displayName: "Barishal (বরিশাল)", deliveryCharge: 120, estimatedDelivery: "2-3 Days", isActive: true },
  { division: "Barishal", divisionBn: "বরিশাল", district: "Patuakhali", districtBn: "পটুয়াখালী", displayName: "Patuakhali (পটুয়াখালী)", deliveryCharge: 120, estimatedDelivery: "3-4 Days", isActive: true },
  { division: "Barishal", divisionBn: "বরিশাল", district: "Bhola", districtBn: "ভোলা", displayName: "Bhola (ভোলা)", deliveryCharge: 120, estimatedDelivery: "3-4 Days", isActive: true },
  { division: "Barishal", divisionBn: "বরিশাল", district: "Pirojpur", districtBn: "পিরোজপুর", displayName: "Pirojpur (পিরোজপুর)", deliveryCharge: 120, estimatedDelivery: "2-3 Days", isActive: true },
  { division: "Barishal", divisionBn: "বরিশাল", district: "Barguna", districtBn: "বরগুনা", displayName: "Barguna (বরগুনা)", deliveryCharge: 120, estimatedDelivery: "3-4 Days", isActive: true },
  { division: "Barishal", divisionBn: "বরিশাল", district: "Jhalakathi", districtBn: "ঝালকাঠি", displayName: "Jhalakathi (ঝালকাঠি)", deliveryCharge: 120, estimatedDelivery: "2-3 Days", isActive: true },

  // 6. সিলেট বিভাগ (Sylhet Division - 4 Districts)
  { division: "Sylhet", divisionBn: "সিলেট", district: "Sylhet", districtBn: "সিলেট", displayName: "Sylhet (সিলেট)", deliveryCharge: 120, estimatedDelivery: "2-3 Days", isActive: true },
  { division: "Sylhet", divisionBn: "সিলেট", district: "Moulvibazar", districtBn: "মৌলভীবাজার", displayName: "Moulvibazar (মৌলভীবাজার)", deliveryCharge: 120, estimatedDelivery: "2-3 Days", isActive: true },
  { division: "Sylhet", divisionBn: "সিলেট", district: "Habiganj", districtBn: "হবিগঞ্জ", displayName: "Habiganj (হবিগঞ্জ)", deliveryCharge: 120, estimatedDelivery: "2-3 Days", isActive: true },
  { division: "Sylhet", divisionBn: "সিলেট", district: "Sunamganj", districtBn: "সুনামগঞ্জ", displayName: "Sunamganj (সুনামগঞ্জ)", deliveryCharge: 120, estimatedDelivery: "2-3 Days", isActive: true },

  // 7. রংপুর বিভাগ (Rangpur Division - 8 Districts)
  { division: "Rangpur", divisionBn: "রংপুর", district: "Rangpur", districtBn: "রংপুর", displayName: "Rangpur (রংপুর)", deliveryCharge: 120, estimatedDelivery: "2-3 Days", isActive: true },
  { division: "Rangpur", divisionBn: "রংপুর", district: "Dinajpur", districtBn: "দিনাজপুর", displayName: "Dinajpur (দিনাজপুর)", deliveryCharge: 120, estimatedDelivery: "2-3 Days", isActive: true },
  { division: "Rangpur", divisionBn: "রংপুর", district: "Kurigram", districtBn: "কুড়িগ্রাম", displayName: "Kurigram (কুড়িগ্রাম)", deliveryCharge: 120, estimatedDelivery: "3-4 Days", isActive: true },
  { division: "Rangpur", divisionBn: "রংপুর", district: "Gaibandha", districtBn: "গাইবান্ধা", displayName: "Gaibandha (গাইবান্ধা)", deliveryCharge: 120, estimatedDelivery: "2-3 Days", isActive: true },
  { division: "Rangpur", divisionBn: "রংপুর", district: "Nilphamari", districtBn: "নীলফামারী", displayName: "Nilphamari (নীলফামারী)", deliveryCharge: 120, estimatedDelivery: "2-3 Days", isActive: true },
  { division: "Rangpur", divisionBn: "রংপুর", district: "Panchagarh", districtBn: "পঞ্চগড়", displayName: "Panchagarh (পঞ্চগড়)", deliveryCharge: 120, estimatedDelivery: "3-4 Days", isActive: true },
  { division: "Rangpur", divisionBn: "রংপুর", district: "Thakurgaon", districtBn: "ঠাকুরগাঁও", displayName: "Thakurgaon (ঠাকুরগাঁও)", deliveryCharge: 120, estimatedDelivery: "3-4 Days", isActive: true },
  { division: "Rangpur", divisionBn: "রংপুর", district: "Lalmonirhat", districtBn: "লালমনিরহাট", displayName: "Lalmonirhat (লালমনিরহাট)", deliveryCharge: 120, estimatedDelivery: "3-4 Days", isActive: true },

  // 8. ময়মনসিংহ বিভাগ (Mymensingh Division - 4 Districts)
  { division: "Mymensingh", divisionBn: "ময়মনসিংহ", district: "Mymensingh", districtBn: "ময়মনসিংহ", displayName: "Mymensingh (ময়মনসিংহ)", deliveryCharge: 120, estimatedDelivery: "2-3 Days", isActive: true },
  { division: "Mymensingh", divisionBn: "ময়মনসিংহ", district: "Jamalpur", districtBn: "জামালপুর", displayName: "Jamalpur (জামালপুর)", deliveryCharge: 120, estimatedDelivery: "2-3 Days", isActive: true },
  { division: "Mymensingh", divisionBn: "ময়মনসিংহ", district: "Sherpur", districtBn: "শেরপুর", displayName: "Sherpur (শেরপুর)", deliveryCharge: 120, estimatedDelivery: "2-3 Days", isActive: true },
  { division: "Mymensingh", divisionBn: "ময়মনসিংহ", district: "Netrokona", districtBn: "নেত্রকোণা", displayName: "Netrokona (নেত্রকোণা)", deliveryCharge: 120, estimatedDelivery: "2-3 Days", isActive: true },
];

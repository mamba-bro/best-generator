
import type { CatgirlAttributes, CatboyAttributes } from './types';

type AttributeOptions<T> = {
  [key in keyof T]: {
    label: string;
    values: string[];
  };
};

export const CATGIRL_ATTRIBUTE_OPTIONS: AttributeOptions<CatgirlAttributes> = {
  hairColor: {
    label: 'Hair Color',
    values: ['Black', 'Blonde', 'Brown', 'White', 'Silver', 'Pastel Pink', 'Lavender', 'Mint Green', 'Sky Blue', 'Ruby Red', 'Crimson Red', 'Deep Ocean Blue', 'Emerald Green', 'Ombre (Pink to Purple)', 'Split Dye (Black/White)', 'Rainbow Streaks', 'Galaxy Nebula', 'Iridescent Pearl', 'Fire Gradient (Red to Yellow)', 'Electric Blue', 'Sakura Pink', 'Platinum Blonde'],
  },
  hairStyle: {
    label: 'Hair Style',
    values: ['Short and Messy', 'Long and Straight', 'Bob Cut', 'Ponytail', 'Long Twintails', 'Braids', 'Wavy Shoulder-length', 'Messy Wolfcut', 'Hime Cut', 'Pixie Cut', 'Afro Puffs', 'Side Shave with Long Bangs', 'Odango Buns', 'Elaborate Victorian Updo', 'Cyberpunk Braids with Glow Strips', 'Drill Curls'],
  },
  eyeColor: {
    label: 'Eye Color',
    values: ['Blue', 'Green', 'Brown', 'Amber', 'Heterochromia (Blue/Green)', 'Purple', 'Red', 'Golden', 'Teal', 'Galaxy Nebula', 'Molten Gold', 'Pink', 'Silver', 'Cybernetic Red Glow', 'Lime Green', 'Clockwork Gears'],
  },
  outfit: {
    label: 'Outfit',
    values: ['Maid Dress', 'School Uniform', 'Gothic Lolita Dress', 'Techwear Gear', 'Cozy Sweater & Skirt', 'Fantasy Armor', 'Kimono', 'Idol Costume', 'Cyberpunk Jumpsuit', 'Victorian Ball Gown', 'Streetwear Hoodie & Jeans', 'Magical Girl Uniform', 'Beach Bikini', 'Traditional Chinese Qipao', 'Steampunk Inventor Outfit', 'Dark Sorceress Robes', 'Futuristic Pilot Suit', 'Oni-themed Battle Armor'],
  },
  earType: {
    label: 'Ear Type',
    values: ['Standard Cat', 'Scottish Fold', 'Lynx-tipped', 'Fluffy Fox-like', 'Panther-like', 'Rounded and Small', 'Elven Pointed', 'Curled Caracal-like', 'Oversized and Floppy', 'Mechanical/Robotic', 'Crystalized Ears', 'Aquatic Fin-like Ears'],
  },
  tailType: {
    label: 'Tail Type',
    values: ['Long and Fluffy', 'Short and Bobbed', 'Thin and Sleek', 'Twin Tails', 'Puffy and Cloud-like', 'Demon-like Spade Tip', 'Skeletal/Bony', 'Prehensile and Coiled', 'Mechanical/Robotic Tail', 'Crystalized Tail', 'Peacock Feather Tail'],
  },
  personality: {
    label: 'Personality / Vibe',
    values: ['Shy and Sweet', 'Energetic and Playful', 'Cool and Aloof', 'Elegant and Mysterious', 'Mischievous Trickster', 'Cheerful and Bubbly', 'Stoic and Protective', 'Sad and Melancholic', 'Yandere (Obsessive)', 'Kuudere (Cold exterior, caring interior)', 'Dandere (Quiet and asocial)', 'Genki (Hyperactive and loud)'],
  },
  background: {
    label: 'Background',
    values: ['Neon-lit Tokyo Street', 'Cozy Library Cafe', 'Magical Forest', 'Futuristic Sci-fi City', 'Cherry Blossom Park', 'Gothic Cathedral Interior', 'Steampunk Workshop', 'Enchanted Library', 'Rooftop at Sunset', 'Post-apocalyptic Ruins', 'Vaporwave Beach', 'Bioluminescent Cave', 'Floating Sky Islands', 'Cyberpunk Data-scape', 'Inside a Giant Clocktower'],
  },
  accessories: {
    label: 'Accessories',
    values: ['None', 'Glasses', 'Hair Ribbons', 'Bell Choker', 'Fingerless Gloves', 'Headphones', 'Band-aids', 'Thigh-high Stockings', 'Eyepatch', 'Gas Mask', 'Floating Halo', 'Devil Horns', 'Witch Hat', 'Fox Mask', 'Cybernetic Implants', 'Floating Runes', 'Steampunk Goggles', 'Jeweled Tiara'],
  },
  artStyle: {
    label: 'Art Style',
    values: ['Vibrant Anime', 'Soft Watercolor', 'Modern Digital Art', 'Ghibli Inspired', 'Retro 90s Anime', 'Ink Wash Painting', 'Chibi/Kawaii', 'Dark Fantasy (Berserk-inspired)', 'Art Nouveau', 'Comic Book (Western)', 'Cyberpunk Neon Noir', 'Ukiyo-e Woodblock', 'Stained Glass Art'],
  },
  posture: {
    label: 'Body Posture',
    values: ['Standing Confidently', 'Sitting Shyly', 'Dynamic Action Pose', 'Leaning Playfully', 'Lounging Gracefully', 'Curled up Cutely', 'Dancing Energetically', 'Fighting Stance', 'Mid-air Jump', 'Crouching Stealthily', 'Offering a Hand'],
  },
};

export const CATBOY_ATTRIBUTE_OPTIONS: AttributeOptions<CatboyAttributes> = {
  hairColor: {
    label: 'Hair Color',
    values: ['Jet Black', 'Ash Blonde', 'Chocolate Brown', 'Snow White', 'Gunmetal Silver', 'Deep Indigo', 'Forest Green', 'Blood Red', 'Split Dye (Black/Red)', 'Frosted Tips', 'Electric Blue Streaks', 'Charcoal Gray'],
  },
  hairStyle: {
    label: 'Hair Style',
    values: ['Short and Spiky', 'Medium Length Shag', 'Slicked Back Undercut', 'Messy Mop-top', 'Curtains', 'Wolf Cut', 'Samurai Top Knot', 'Buzz Cut', 'Side Part', 'Long and Flowing', 'Cyberpunk Braids'],
  },
  eyeColor: {
    label: 'Eye Color',
    values: ['Ice Blue', 'Emerald Green', 'Warm Hazel', 'Onyx Black', 'Heterochromia (Gold/Blue)', 'Violet', 'Crimson Red', 'Molten Gold', 'Cybernetic Green Glow', 'Silver', 'Amber'],
  },
  outfit: {
    label: 'Outfit',
    values: ['Butler Suit', 'Streetwear Hoodie & Cargo Pants', 'Techwear Jacket & Gear', 'Fantasy Prince Attire', 'Rocker Leather Jacket & Jeans', 'Traditional Samurai Hakama', 'Cozy Knit Sweater', 'Cyberpunk Mercenary Gear', 'Steampunk Aviator Outfit', 'Dark Mage Robes', 'Post-apocalyptic Wanderer Gear'],
  },
  earType: {
    label: 'Ear Type',
    values: ['Sleek Panther', 'Wild Lynx-tipped', 'Domestic Shorthair', 'Fluffy Maine Coon', 'Sharp and Pointed', 'Slightly Rounded', 'Mechanical/Cyborg', 'Battle-scarred/Notched'],
  },
  tailType: {
    label: 'Tail Type',
    values: ['Long and Sleek', 'Short Bobtail', 'Fluffy and Expressive', 'Thin and Wiry', 'Tufted Lion-like', 'Armored Mechanical Tail', 'Prehensile and Agile'],
  },
  personality: {
    label: 'Personality / Vibe',
    values: ['Cool and Confident', 'Playful and Energetic', 'Stoic and Protective', 'Shy and Bookish', 'Mischievous and Charming', 'Rebellious and Brooding', 'Kind and Gentle', 'Flirty and Suave', 'Tsundere (Harsh exterior, soft interior)'],
  },
  background: {
    label: 'Background',
    values: ['Gritty Cyberpunk Alley', 'Rooftop overlooking a Metropolis', 'Serene Bamboo Forest', 'Throne Room in a Castle', 'Cozy Gaming Room', 'Mechanic\'s Workshop', 'Post-apocalyptic Cityscape', 'Rainy Neo-Noir Street'],
  },
  accessories: {
    label: 'Accessories',
    values: ['None', 'Stylish Glasses', 'Single Earring', 'Dog Tags', 'Leather Gloves', 'Beanie Hat', 'Cybernetic Visor', 'Face Mask', 'Chains', 'Steampunk Goggles', 'Bandana'],
  },
  artStyle: {
    label: 'Art Style',
    values: ['Modern Anime', 'Gritty Comic Book', 'Cel-shaded Video Game', 'Retro 80s Anime', 'Dark Fantasy Illustration', 'Ink Wash Painting', 'Cyberpunk Neon Noir', 'Ukiyo-e Woodblock'],
  },
  posture: {
    label: 'Body Posture',
    values: ['Leaning against a wall', 'Confident Stance', 'Action-ready crouch', 'Sitting thoughtfully', 'Dynamic mid-movement pose', 'Relaxed and lounging', 'Protective fighting stance'],
  },
};

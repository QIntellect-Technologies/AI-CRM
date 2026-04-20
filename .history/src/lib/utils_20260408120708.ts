import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getAvatarUrl(name: string = '', id: string | number = 1): string {
  if (!name) return `https://randomuser.me/api/portraits/lego/${id}.jpg`;
  
  const femaleList = [
    'sara', 'sarah', 'reem', 'fatima', 'aisha', 'layla', 'maryam', 'zainab', 
    'khadija', 'amna', 'shamsa', 'maha', 'hind', 'nouf', 'salma', 'jasmine', 
    'maria', 'emily', 'jessica', 'huda', 'mona', 'nada', 'rasha', 'samira'
  ];
  
  const firstName = name.split(' ')[0].toLowerCase();
  const isFemale = femaleList.includes(firstName);
  const gender = isFemale ? 'women' : 'men';
  
  // Generate a consistent numeric ID between 1 and 99 based on the string id and name
  const hashString = String(id) + name;
  let numId = 1;
  for (let i = 0; i < hashString.length; i++) {
    numId += hashString.charCodeAt(i);
  }
  
  // Ensure we get a valid number 1-99 for randomuser.me portraits
  const portraitId = (numId % 99) || 1;
  
  return `https://randomuser.me/api/portraits/${gender}/${portraitId}.jpg`;
}

// src/features/hostels/mockData.js
//
// Mock hostel catalogue. Shape mirrors the future API response described in
// HandOver-05 / the implementation plan:
//   GET /students/api/hostels/v1/catalogue
//   POST /students/api/hostels/v1/reservations
//
// When the real endpoint ships, only the bodies of getHostels() and
// reserveHostel() below need to change — the page and HostelCard component
// already consume this exact object shape.

export const HOSTEL_TYPES = ['Single', 'Double', 'Triple', 'Dormitory']
export const HOSTEL_GENDERS = ['Male', 'Female', 'Mixed']

const hostels = [
  {
    id: 'hst_001',
    name: 'Freedom Hall',
    gender: 'Male',
    room_type: 'Single',
    price_per_semester: 850000,
    currency: 'UGX',
    distance_from_campus_km: 0.3,
    availability: 'available',       // available | limited | full
    rooms_available: 12,
    rating: 4.4,
    amenities: ['Wi-Fi', 'Hot Shower', 'Reading Room', '24/7 Security', 'Backup Power'],
    image_placeholder: 'hostel-freedom-hall',
  },
  {
    id: 'hst_002',
    name: 'Unity Court',
    gender: 'Female',
    room_type: 'Double',
    price_per_semester: 620000,
    currency: 'UGX',
    distance_from_campus_km: 0.5,
    availability: 'limited',
    rooms_available: 3,
    rating: 4.1,
    amenities: ['Wi-Fi', 'Laundry', 'Common Kitchen', '24/7 Security'],
    image_placeholder: 'hostel-unity-court',
  },
  {
    id: 'hst_003',
    name: 'Scholars Lodge',
    gender: 'Mixed',
    room_type: 'Triple',
    price_per_semester: 480000,
    currency: 'UGX',
    distance_from_campus_km: 1.2,
    availability: 'available',
    rooms_available: 21,
    rating: 3.9,
    amenities: ['Wi-Fi', 'Study Lounge', 'Backup Power'],
    image_placeholder: 'hostel-scholars-lodge',
  },
  {
    id: 'hst_004',
    name: 'Greenfield Residences',
    gender: 'Female',
    room_type: 'Single',
    price_per_semester: 980000,
    currency: 'UGX',
    distance_from_campus_km: 0.2,
    availability: 'full',
    rooms_available: 0,
    rating: 4.7,
    amenities: ['Wi-Fi', 'Hot Shower', 'Gym Access', '24/7 Security', 'Backup Power', 'Cafeteria'],
    image_placeholder: 'hostel-greenfield',
  },
  {
    id: 'hst_005',
    name: 'Cedar Heights',
    gender: 'Male',
    room_type: 'Dormitory',
    price_per_semester: 320000,
    currency: 'UGX',
    distance_from_campus_km: 1.8,
    availability: 'available',
    rooms_available: 40,
    rating: 3.6,
    amenities: ['Wi-Fi', 'Common Kitchen'],
    image_placeholder: 'hostel-cedar-heights',
  },
  {
    id: 'hst_006',
    name: 'Maple Court',
    gender: 'Mixed',
    room_type: 'Double',
    price_per_semester: 540000,
    currency: 'UGX',
    distance_from_campus_km: 0.9,
    availability: 'limited',
    rooms_available: 2,
    rating: 4.0,
    amenities: ['Wi-Fi', 'Laundry', '24/7 Security', 'Backup Power'],
    image_placeholder: 'hostel-maple-court',
  },
]

// Existing reservation for the current student, or null if none.
// Mirrors GET /students/api/hostels/v1/reservations/me from the wishlist.
let myReservation = null

function delay(ms = 350) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * future: GET /students/api/hostels/v1/catalogue
 * @param {{ gender?: string, room_type?: string, maxPrice?: number, search?: string }} filters
 */
export async function getHostels(filters = {}) {
  await delay()
  let results = [...hostels]

  if (filters.gender) {
    results = results.filter((h) => h.gender === filters.gender)
  }
  if (filters.room_type) {
    results = results.filter((h) => h.room_type === filters.room_type)
  }
  if (filters.maxPrice) {
    results = results.filter((h) => h.price_per_semester <= filters.maxPrice)
  }
  if (filters.search) {
    const q = filters.search.trim().toLowerCase()
    results = results.filter((h) => h.name.toLowerCase().includes(q))
  }

  return {
    data: {
      data: {
        hostels: results,
        my_reservation: myReservation,
      },
    },
  }
}

/**
 * future: POST /students/api/hostels/v1/reservations
 * @param {string} hostelId
 */
export async function reserveHostel(hostelId) {
  await delay(500)
  const hostel = hostels.find((h) => h.id === hostelId)

  if (!hostel) {
    return {
      data: {
        data: {
          result: 'not_found',
          message: 'This hostel could not be found.',
        },
      },
    }
  }

  if (hostel.availability === 'full' || hostel.rooms_available <= 0) {
    return {
      data: {
        data: {
          result: 'full',
          message: `${hostel.name} has no rooms available right now.`,
        },
      },
    }
  }

  if (myReservation) {
    return {
      data: {
        data: {
          result: 'already_reserved',
          message: `You already have an active reservation at ${myReservation.hostel_name}. Cancel it before booking another hostel.`,
        },
      },
    }
  }

  myReservation = {
    hostel_id: hostel.id,
    hostel_name: hostel.name,
    room_type: hostel.room_type,
    status: 'pending_payment',
    reserved_at: new Date().toISOString(),
  }

  return {
    data: {
      data: {
        result: 'reserved',
        message: `${hostel.name} reserved. Complete payment to confirm your room.`,
        reservation: myReservation,
      },
    },
  }
}
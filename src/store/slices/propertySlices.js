import { createSlice, nanoid } from "@reduxjs/toolkit";

const emptyProperty = {
  propertyType: "",
  size: "",
  dimension: "",
  location: "",
  landmark: "",
  city: "",
  mapLink: "",
  demandPrice: "",
  sellingPreference: "Normal",
  name: "",
  mobile: "",
  whatsapp: "",
  description: "",
};

const dummyExampleProperty = [
  {
    "id": "p1",
    "propertyType": "Residential plot",
    "category": "plots",
    "size": "1500 sq ft",
    "length": 150,
    "width": 60,
    "location": "Sector 12",
    "landmark": "Near City Mall",
    "city": "Udaipur",
    "mapLink": "https://maps.google.com/?q=Udaipur",
    "demandPrice": "28,00,000",
    "sellingPreference": "Normal",
    "name": "Rahul Sharma",
    "mobile": "9876543210",
    "whatsapp": "9876543210",
    "description": "East-facing plot in prime location with wide road.",
    "image": "https://i.pinimg.com/1200x/7d/34/84/7d348438789ab4dc3ab666cbaeb0b225.jpg"
  },
  {
    "id": "p2",
    "propertyType": "3 BHK Flat",
    "category": "flats",
    "size": "1450 sq ft",
    "length": 150,
    "width": 50,
    "location": "Hiran Magri",
    "landmark": "Near DPS School",
    "city": "Udaipur",
    "mapLink": "https://maps.google.com/?q=Hiran+Magri",
    "demandPrice": "52,00,000",
    "sellingPreference": "Urgent",
    "name": "Sonu Verma",
    "mobile": "9123456789",
    "whatsapp": "9123456789",
    "description": "Fully furnished 3 BHK apartment with parking and lift.",
    "image": "https://i.pinimg.com/1200x/7d/34/84/7d348438789ab4dc3ab666cbaeb0b225.jpg"
  },
  {
    "id": "p3",
    "propertyType": "Commercial Shop",
    "category": "office_shop",
    "size": "250 sq ft",
    "length": 50,
    "width": 5,
    "location": "Surajpole",
    "landmark": "Near Bapu Bazar",
    "city": "Udaipur",
    "mapLink": "https://maps.google.com/?q=Surajpole",
    "demandPrice": "40,00,000",
    "sellingPreference": "Normal",
    "name": "Mohit Jain",
    "mobile": "9988776655",
    "whatsapp": "9988776655",
    "description": "Ground floor shop at high footfall location.",
    "image": "https://i.pinimg.com/1200x/7d/34/84/7d348438789ab4dc3ab666cbaeb0b225.jpg"
  },
  {
    "id": "p4",
    "propertyType": "Commercial Shop",
    "category": "Shop/Godown/Office",
    "size": "250 sq ft",
    "length": 50,
    "width": 5,
    "location": "Surajpole",
    "landmark": "Near Bapu Bazar",
    "city": "Udaipur",
    "mapLink": "https://maps.google.com/?q=Surajpole",
    "demandPrice": "40,00,000",
    "sellingPreference": "Normal",
    "name": "Mohit Jain",
    "mobile": "9988776655",
    "whatsapp": "9988776655",
    "description": "Ground floor shop at high footfall location.",
    "image": "https://i.pinimg.com/1200x/7d/34/84/7d348438789ab4dc3ab666cbaeb0b225.jpg"
  },
  {
    "id": "p5",
    "propertyType": "Commercial Shop",
    "category": "Shop/Godown/Office",
    "size": "250 sq ft",
    "length": 50,
    "width": 5,
    "location": "Surajpole",
    "landmark": "Near Bapu Bazar",
    "city": "Udaipur",
    "mapLink": "https://maps.google.com/?q=Surajpole",
    "demandPrice": "40,00,000",
    "sellingPreference": "Normal",
    "name": "Mohit Jain",
    "mobile": "9988776655",
    "whatsapp": "9988776655",
    "description": "Ground floor shop at high footfall location.",
    "image": "https://i.pinimg.com/1200x/7d/34/84/7d348438789ab4dc3ab666cbaeb0b225.jpg"
  },
  {
    "id": "p6",
    "propertyType": "Commercial Shop",
    "category": "Shop/Godown/Office",
    "size": "250 sq ft",
    "length": 50,
    "width": 5,
    "location": "Surajpole",
    "landmark": "Near Bapu Bazar",
    "city": "Udaipur",
    "mapLink": "https://maps.google.com/?q=Surajpole",
    "demandPrice": "40,00,000",
    "sellingPreference": "Normal",
    "name": "Mohit Jain",
    "mobile": "9988776655",
    "whatsapp": "9988776655",
    "description": "Ground floor shop at high footfall location.",
    "image": "https://i.pinimg.com/1200x/7d/34/84/7d348438789ab4dc3ab666cbaeb0b225.jpg"
  },
  {
    "id": "p7",
    "propertyType": "Commercial Shop",
    "category": "Shop/Godown/Office",
    "size": "250 sq ft",
    "length": 50,
    "width": 5,
    "location": "Surajpole",
    "landmark": "Near Bapu Bazar",
    "city": "Udaipur",
    "mapLink": "https://maps.google.com/?q=Surajpole",
    "demandPrice": "40,00,000",
    "sellingPreference": "Normal",
    "name": "Mohit Jain",
    "mobile": "9988776655",
    "whatsapp": "9988776655",
    "description": "Ground floor shop at high footfall location.",
    "image": "https://i.pinimg.com/1200x/7d/34/84/7d348438789ab4dc3ab666cbaeb0b225.jpg"
  },
  {
    "id": "p8",
    "propertyType": "Commercial Shop",
    "category": "Shop/Godown/Office",
    "size": "250 sq ft",
    "length": 50,
    "width": 5,
    "location": "Surajpole",
    "landmark": "Near Bapu Bazar",
    "city": "Udaipur",
    "mapLink": "https://maps.google.com/?q=Surajpole",
    "demandPrice": "40,00,000",
    "sellingPreference": "Normal",
    "name": "Mohit Jain",
    "mobile": "9988776655",
    "whatsapp": "9988776655",
    "description": "Ground floor shop at high footfall location.",
    "image": "https://i.pinimg.com/1200x/7d/34/84/7d348438789ab4dc3ab666cbaeb0b225.jpg"
  },
  {
    "id": "p9",
    "propertyType": "Agricultural Land",
    "category": "agriculture_land",
    "size": "5 Acres",
    "length": 400,
    "width": 500,
    "location": "Outskirts",
    "landmark": "Near National Highway 8",
    "city": "Udaipur",
    "mapLink": "http://googleusercontent.com/maps.google.com/3",
    "demandPrice": "90,00,000",
    "sellingPreference": "Normal",
    "name": "Arvind Singh",
    "mobile": "9000011111",
    "whatsapp": "9000011111",
    "description": "Fertile farm land with borewell access and boundary walls.",
    "image": "https://i.pinimg.com/1200x/7d/34/84/7d348438789ab4dc3ab666cbaeb0b225.jpg"
  },
  {
    "id": "p10",
    "propertyType": "4 BHK Villa",
    "category": "house_apartment",
    "size": "3000 sq ft",
    "length": 50,
    "width": 60,
    "location": "Shakti Nagar",
    "landmark": "Near Fatehsagar Lake",
    "city": "Udaipur",
    "mapLink": "http://googleusercontent.com/maps.google.com/4",
    "demandPrice": "1,80,00,000",
    "sellingPreference": "Urgent",
    "name": "Priya Patel",
    "mobile": "9555544444",
    "whatsapp": "9555544444",
    "description": "Luxury villa with a private garden and rooftop access.",
    "image": "https://i.pinimg.com/1200x/7d/34/84/7d348438789ab4dc3ab666cbaeb0b225.jpg"
  }
]

const propertySlice = createSlice({
  name: "property",

  initialState: {
    properties: [...dummyExampleProperty],
    currentProperty: emptyProperty,
  },

  reducers: {
    updateCurrentField: (state, action) => {
      const { key, value } = action.payload;
      state.currentProperty[key] = value;
    },

    resetCurrentProperty: (state) => {
      state.currentProperty = emptyProperty;
    },

    addProperty: (state) => {
      state.properties.push({
        id: nanoid(),
        ...state.currentProperty,
      });

      state.currentProperty = emptyProperty;
    },

    setCurrentProperty: (state, action) => {
      state.currentProperty = action.payload;
    },

    updateProperty: (state, action) => {
      const updated = action.payload;
      state.properties = state.properties.map((p) =>
        p.id === updated.id ? updated : p
      );
    },

    deleteProperty: (state, action) => {
      const id = action.payload;
      state.properties = state.properties.filter((p) => p.id !== id);
    },
  },
});

export const {
  updateCurrentField,
  resetCurrentProperty,
  addProperty,
  setCurrentProperty,
  updateProperty,
  deleteProperty,
} = propertySlice.actions;

export default propertySlice.reducer;
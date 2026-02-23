import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchProperties, getPropertyById, saveProperty, removeSavedProperty, getSavedProperties, fetchMyProperties } from "../../services/property.service";
import { fetchDashboardAnalytics } from "../../services/analytics.service";

// Async Thunk to Fetch All Properties
export const fetchPropertiesAsync = createAsyncThunk(
  "property/fetchProperties",
  async (_, { rejectWithValue }) => {
    try {
      // 1. Fetch Analytics to know the target counts
      let targetCounts = { agriculture_land: 5, house_apartment: 5, office_shop: 5, plots: 5 };
      try {
        const analyticsResponse = await fetchDashboardAnalytics();
        const counts = analyticsResponse?.data?.properties?.categories || {};
        targetCounts = {
          agriculture_land: Math.min(counts.agriculture_land || 0, 5),
          house_apartment: Math.min(counts.house_apartment || 0, 5),
          office_shop: Math.min(counts.office_shop || 0, 5),
          plots: Math.min(counts.plots || 0, 5),
        };
      } catch (err) {
        console.warn("Could not fetch analytics, defaulting target counts to 5.", err);
      }

      let allProperties = [];
      let page = 1;
      const limit = 20;

      const currentCounts = {
        agriculture_land: 0,
        house_apartment: 0,
        office_shop: 0,
        plots: 0,
      };

      const seenIds = new Set();
      let hasMoreFromServer = true;

      const checkCondition = () => {
        return (
          currentCounts.agriculture_land >= targetCounts.agriculture_land &&
          currentCounts.house_apartment >= targetCounts.house_apartment &&
          currentCounts.office_shop >= targetCounts.office_shop &&
          currentCounts.plots >= targetCounts.plots
        );
      };

      // Loop until we reach our target counts or run out of pages (limit to 10 iterations max)
      while ((page === 1 || !checkCondition()) && hasMoreFromServer && page <= 10) {
        const response = await fetchProperties({ page, limit });
        let data = Array.isArray(response) ? response : (response?.data?.properties || response?.properties || []);

        if (!data || data.length === 0) {
          hasMoreFromServer = false;
          break;
        }

        for (const prop of data) {
          const id = prop._id || prop.id;
          if (id && seenIds.has(id)) continue;
          if (id) seenIds.add(id);

          const cat = (prop.propertyCategory || prop.category || '').trim().toLowerCase();

          // Categorize and track counts logically based on utils
          if (['agriculture_land', 'agricultural', 'farm', 'land'].some(c => cat.includes(c))) currentCounts.agriculture_land++;
          else if (['house_apartment', 'flats', 'house/apartment/flat', 'house', 'apartment', 'villa'].some(c => cat.includes(c))) currentCounts.house_apartment++;
          else if (['office_shop', 'shop', 'office', 'godown'].some(c => cat.includes(c))) currentCounts.office_shop++;
          else if (cat === 'plots' || cat.includes('plots')) currentCounts.plots++;

          allProperties.push(prop);
        }

        // If returned data length is less than our requested limit, then we are at the end
        if (data.length < limit) {
          hasMoreFromServer = false;
        }

        page++;
      }

      return allProperties;
    } catch (error) {
      console.error("Fetch Error:", error);
      return rejectWithValue(error.message);
    }
  }
);

// Async Thunk to Fetch LISTING Properties (Server-Side Filtered)
export const fetchListingPropertiesAsync = createAsyncThunk(
  "property/fetchListingProperties",
  async (params, { rejectWithValue }) => {
    try {
      const response = await fetchProperties(params);
      let data = Array.isArray(response) ? response.data.properties : (response.data?.properties || response.properties || []);

      return {
        data,
        page: params.page || 1,
        hasMore: data.length === (params.limit || 10) // Simple heuristic
      };
    } catch (error) {
      console.error("Listing Fetch Error:", error);
      return rejectWithValue(error.message);
    }
  }
);

// Async Thunk to Fetch Property Details
export const fetchPropertyByIdAsync = createAsyncThunk(
  "property/fetchPropertyById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await getPropertyById(id);
      return response.data || response; // Adjust based on API structure
    } catch (error) {
      console.error("Fetch Detail Error:", error);
      return rejectWithValue(error.message);
    }
  }
);

// Async Thunk to Save Property
export const savePropertyAsync = createAsyncThunk(
  "property/saveProperty",
  async (data, { rejectWithValue }) => {
    try {
      const response = await saveProperty(data); // { userId, propertyId }
      return { propertyId: data.propertyId, response };
    } catch (error) {
      console.error("Save Property Error:", error);
      return rejectWithValue(error.message);
    }
  }
);

// Async Thunk to Remove Saved Property
// Async Thunk to Remove Saved Property
export const removeSavedPropertyAsync = createAsyncThunk(
  "property/removeSavedProperty",
  async (data, { rejectWithValue }) => {
    try {
      const response = await removeSavedProperty(data); // { userId, propertyId }
      return { propertyId: data.propertyId, response };
    } catch (error) {
      console.error("Remove Saved Error:", error);
      return rejectWithValue(error.message);
    }
  }
);

// Async Thunk to Fetch Saved Properties List
export const fetchSavedPropertiesAsync = createAsyncThunk(
  "property/fetchSavedProperties",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await getSavedProperties(userId);
      // Adjust based on response structure, e.g. { properties: [...] }
      const data = Array.isArray(response) ? response : (response.data || response.properties || []);
      return data;
    } catch (error) {
      console.error("Fetch Saved Properties Error:", error);
      return rejectWithValue(error.message);
    }
  }
);



// Async Thunk to Fetch User's Properties
export const fetchMyPropertiesAsync = createAsyncThunk(
  "property/fetchMyProperties",
  async (userId, { rejectWithValue }) => {
    try {
      // Use dedicated endpoint
      const response = await fetchMyProperties();
      // Adjust structure if needed, usually response.data is the payload
      let data = Array.isArray(response) ? response.data : (response.data?.properties || response.properties || response.data || []);
      return data;
    } catch (error) {
      console.error("Fetch My Properties Error:", error);
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  properties: [], // Stores ALL properties fetched from API
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,

  // Separate state for the Property Listing Screen (Server-Side Filtered)
  listing: [],
  listingStatus: 'idle',
  listingError: null,
  listingPagination: {
    page: 1,
    hasMore: true,
  },

  // Current Property Details
  currentProperty: null,
  currentPropertyStatus: 'idle',
  currentPropertyError: null,

  // Saved Properties Trackers
  savedPropertyIds: [], // List of IDs (for quick check)
  savedPropertiesList: [], // List of Objects (for Saved Screen)
  savedPropertiesStatus: 'idle',
  savedPropertiesError: null,
  savedPropertiesStatus: 'idle',
  savedPropertiesError: null,
  saveStatus: 'idle', // 'idle' | 'saving' | 'removing'

  // My Properties
  myProperties: [],
  myPropertiesStatus: 'idle',
  myPropertiesError: null,
};

const propertySlice = createSlice({
  name: "property",
  initialState,
  reducers: {
    // Add any synchronous reducers if needed here
    clearProperties: (state) => {
      state.properties = [];
      state.status = 'idle';
    },
    clearListingProperties: (state) => {
      state.listing = [];
      state.listingStatus = 'idle';
      state.listingPagination = { page: 1, hasMore: true };
    },
    clearCurrentProperty: (state) => {
      state.currentProperty = null;
      state.currentPropertyStatus = 'idle';
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPropertiesAsync.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchPropertiesAsync.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.properties = action.payload;
      })
      .addCase(fetchPropertiesAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // LISTING Handlers
      .addCase(fetchListingPropertiesAsync.pending, (state) => {
        state.listingStatus = "loading";
        state.listingError = null;
      })
      .addCase(fetchListingPropertiesAsync.fulfilled, (state, action) => {
        state.listingStatus = "succeeded";
        const { data, page, hasMore } = action.payload;

        if (page === 1) {
          state.listing = data;
        } else {
          // Append for pagination
          state.listing = [...state.listing, ...data];
        }

        state.listingPagination.page = page;
        state.listingPagination.hasMore = hasMore;
      })
      .addCase(fetchListingPropertiesAsync.rejected, (state, action) => {
        state.listingStatus = "failed";
        state.listingError = action.payload;
      })

      // DETAILS Handlers
      .addCase(fetchPropertyByIdAsync.pending, (state) => {
        state.currentPropertyStatus = "loading";
        state.currentPropertyError = null;
      })
      .addCase(fetchPropertyByIdAsync.fulfilled, (state, action) => {
        state.currentPropertyStatus = "succeeded";
        state.currentProperty = action.payload;
      })
      .addCase(fetchPropertyByIdAsync.rejected, (state, action) => {
        state.currentPropertyStatus = "failed";
        state.currentPropertyError = action.payload;
      })

      // SAVE/REMOVE Handlers
      .addCase(savePropertyAsync.fulfilled, (state, action) => {
        const { propertyId } = action.payload;
        if (!state.savedPropertyIds.includes(propertyId)) {
          state.savedPropertyIds.push(propertyId);
        }
      })
      .addCase(removeSavedPropertyAsync.fulfilled, (state, action) => {
        const { propertyId } = action.payload;
        state.savedPropertyIds = state.savedPropertyIds.filter(id => id !== propertyId);
        // Also remove from the list if present
        state.savedPropertiesList = state.savedPropertiesList.filter(p => p.id !== propertyId && p._id !== propertyId);
      })

      // FETCH SAVED LIST Handlers
      .addCase(fetchSavedPropertiesAsync.pending, (state) => {
        state.savedPropertiesStatus = "loading";
        state.savedPropertiesError = null;
      })
      .addCase(fetchSavedPropertiesAsync.fulfilled, (state, action) => {
        state.savedPropertiesStatus = "succeeded";
        state.savedPropertiesList = action.payload;
        // Sync IDs for quick access
        // The payload contains wrapper objects, so we need to access item.property.id
        state.savedPropertyIds = action.payload.map(p => p.property?.id || p.property?._id || p.propertyId);
      })
      .addCase(fetchSavedPropertiesAsync.rejected, (state, action) => {
        state.savedPropertiesStatus = "failed";
        state.savedPropertiesError = action.payload;
      })

      // MY PROPERTIES Handlers
      .addCase(fetchMyPropertiesAsync.pending, (state) => {
        state.myPropertiesStatus = "loading";
        state.myPropertiesError = null;
      })
      .addCase(fetchMyPropertiesAsync.fulfilled, (state, action) => {
        state.myPropertiesStatus = "succeeded";
        state.myProperties = action.payload;
      })
      .addCase(fetchMyPropertiesAsync.rejected, (state, action) => {
        state.myPropertiesStatus = "failed";
        state.myPropertiesError = action.payload;
      });


  },
});

export const { clearProperties, clearListingProperties, clearCurrentProperty } = propertySlice.actions;

export default propertySlice.reducer;
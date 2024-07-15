import { Children, createContext,
useContext,
useEffect,
useReducer,useState } from "react";

const GlobalContext = createContext();

const baseUrl = "https://api.jikan.moe/v4";

  // actions
  const LOADING = "LOADING";
  const SEARCH = "SEARCH";
  const GET_POPULAR_ANIME = "GET_POPULAR_ANIME";
  const GET_UPCOMING_ANIME = "GET_UPCOMING_ANIME";
  const GET_AIRING_ANIME = "GET_AIRING_ANIME";
  const GET_PICTURES = "GET_PICTURES";
  const GET_POPULAR_ANIME_PG = "GET_POPULAR_ANIME_PG";

  // reducer
  const reducer = (state, action) => {
    switch (action.type) {
      case LOADING:
        return { ...state, loading: true };
      case GET_POPULAR_ANIME:
        return { ...state, popularAnime: action.payload, loading: false };
       case GET_POPULAR_ANIME_PG:
            return { ...state, popularAnimePG: action.payload, loading: false };
      case SEARCH:
        return { ...state, searchResults: action.payload, loading: false };
      case GET_UPCOMING_ANIME:
        return { ...state, upcomingAnime: action.payload, loading: false };
      case GET_AIRING_ANIME:
        return { ...state, airingAnime: action.payload, loading: false };
      case GET_PICTURES:
        return { ...state, pictures: action.payload, loading: false };
      default:
        return state;
    }
  };

  export const GlobalContextProvider = ({ children }) => {
    // Initial State
    const initialState = {
      popularAnime: [],
      upcomingAnime: [],
      airingAnime: [],
      pictures: [],
      popularAnimePG:[],
      isSearch: false,
      searchResults: [],
      loading: false,
    };
  
    const [state, dispatch] = useReducer(reducer, initialState);
  
    const [search, setSearch] = useState("");
  
    // handle change

  const handleChange2 = (e) => {
    setSearch(e.target.value);
    state.isSearch = true; // Assuming this is necessary for your application logic
  
    // Implement debounced search using a closure and setTimeout
    const timeoutId = setTimeout(() => {
      searchAnime(e.target.value);
      if (e.target.value === "") {
                state.isSearch = false;
              } // Update isSearch based on search value
    }, 300); // Adjust debounce delay as needed
  
    // Clear any previous timeout on subsequent keystrokes
    return () => clearTimeout(timeoutId);
  };

        const handleChange = (e) => {
            setSearch(e.target.value);
      searchAnime(search);
      state.isSearch = true;
            if (e.target.value === "") {
              state.isSearch = false;
            }
          };

   
  
    // handle submit
    const handleSubmit = (e) => {
      e.preventDefault();
      if (search) {
        searchAnime(search);
        state.isSearch = true;
      } else {
        state.isSearch = false;
        alert("Please enter a search term");
      }
    };
  
    //   fetch popular anime
    const getPopularAnime = async () => {
      dispatch({ type: LOADING });
      const response = await fetch(`${baseUrl}/top/anime?filter=bypopularity`);
  
      const data = await response.json();
      dispatch({ type: GET_POPULAR_ANIME, payload: data.data });
    };

        //   fetch popular anime
        const getPopularAnimePG = async () => {
            dispatch({ type: LOADING });
            const response = await fetch(`${baseUrl}/top/anime?filter=bypopularity&rating=pg`);
        
            const data = await response.json();
            dispatch({ type: GET_POPULAR_ANIME_PG, payload: data.data });
          };
  
    // fetch upcoming anime
    const getUpcomingAnime = async () => {
      dispatch({ type: LOADING });
      const response = await fetch(`${baseUrl}/top/anime?filter=upcoming`);
      const data = await response.json();
      dispatch({ type: GET_UPCOMING_ANIME, payload: data.data });
    };
  
    // fetch airing anime
    const getAiringAnime = async () => {
      dispatch({ type: LOADING });
      const response = await fetch(`${baseUrl}/top/anime?filter=airing`);
      const data = await response.json();
      dispatch({ type: GET_AIRING_ANIME, payload: data.data });
    };
  
    // search anime
    const searchAnime = async (anime) => {
      dispatch({ type: LOADING });
  
      const response = await fetch(
        `https://api.jikan.moe/v4/anime?q=${anime}&order_by=popularity&sort=asc&sfw`
      );
  
      const data = await response.json();
      dispatch({ type: SEARCH, payload: data.data });
    };
  
    // get anime pictures
    const getAnimePictures = async (id) => {
      dispatch({ type: LOADING });
      const response = await fetch(`${baseUrl}/characters/${id}/pictures`);
      const data = await response.json();
      dispatch({ type: GET_PICTURES, payload: data.data });
    };
  
    //   initial render
    useEffect(() => {
      getPopularAnime();
    }, []);
  
    return (
      <GlobalContext.Provider
        value={{
          ...state,
          handleChange,
          handleSubmit,
          searchAnime,
          search,
          getPopularAnime,
          getUpcomingAnime,
          getAiringAnime,
          getAnimePictures,
          getPopularAnimePG,
          debouncedHandleChange
        }}
      >
        {children}
      </GlobalContext.Provider>
    );
  };
  
  export const useGlobalContext = () => {
    return useContext(GlobalContext);
  };

import React, { useEffect, useState } from 'react';
import axios from "axios";
import Pagination from './Pagination';
import { Oval } from "react-loader-spinner";

function Movies() {
    let [movies, setMovies] = useState([]);
    let [pageNum, setPage] = useState(1);
    let [hovered, setHovered] = useState("");
    let [favourites, setFavorites] = useState([]);

    useEffect(() => {
        const getApiData = () => {
            axios
                .get
                (`${process.env.REACT_APP_API_URL}/3/trending/all/week?api_key=${process.env.REACT_APP_API_KEY}&page=` + pageNum)
                .then((res) => {
                    setMovies(res.data.results);
                })
        };
        getApiData();
    }, [pageNum])



    const onPrev = () => {
        if (pageNum > 1) {
            setPage(pageNum - 1);
        }
    }

    const onNext = () => {
        setPage(pageNum + 1);

    }

    const showEmoji = (id) => {
        setHovered(id);
    }

    const hideEmoji = () => {
        setHovered("");
    }


    const addEmoji = (id) => {
        const newFav = [...favourites, id];
        setFavorites(newFav);
    }

    const removeEmoji = (id) => {
        const filteredFav = favourites.filter(elem => {
            return elem !== id;
        })
        setFavorites(filteredFav);
    }


    return (
        <div className="mt-8">
            <div className="mb-8 font-bold text-2xl text-center">Trending Movies</div>
            <div className="flex flex-wrap justify-center">
                {
                    movies.length === 0 ? <Oval
                        height="80"
                        width="80"
                        radius="9"
                        color="gray"
                        secondaryColor='gray'
                        ariaLabel="loading"

                    /> : movies.map((movie) => {

                        return <div onMouseOver={() => { showEmoji(movie.id) }} onMouseLeave={() => { hideEmoji(movie.id) }} key={movie.id}
                                className="
                                    bg-center bg-cover    
                                    w-[160px]
                                    h-[30vh]
                                    md: h-[40vh]
                                    md:w-[180px]
                                    m-4
                                    rounded-xl
                                    hover:scale-110
                                    duration-300
                                    flex items-end 
                                    relative"
                                style={{ backgroundImage: `url(https://image.tmdb.org/t/p/original/t/p/w500/${movie.poster_path})`}}>
                            <div
                                className="p-2
                                bg-gray-900
                                  absolute top-2 right-2
                                  rounded-xl"
                                style={{
                                    display: hovered === movie.id ?
                                        "block" : "none"
                                }}
                            >
                                {
                                    favourites.includes(movie.id) === false ? 
                                        <div className="text-2xl" onClick={() => { addEmoji(movie.id) }}>
                                            😍
                                        </div> : 
                                        <div className="text-2xl" onClick={() => { removeEmoji(movie.id) }}>
                                            ❌
                                        </div>
                                }
                            </div>
                            <div
                                className="font-bold text-white
                bg-gray-900 bg-opacity-60 p-2 text-center w-full
                rounded-b-xl
                "> {movie.title || movie.name}</div>
                        </div>
                    })
                }
            </div>
            <Pagination
                pageNum={pageNum}
                onPrev={onPrev}
                onNext={onNext}
            ></Pagination>
        </div >
    )
}

export default Movies;
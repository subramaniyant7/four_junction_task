import React, { useEffect, useState } from 'react'
import axios from "axios";
import { Oval } from "react-loader-spinner";

const Banner = () => {
    let [bannerMovie, setBanner] = useState("");
    useEffect(() => {
        const getApiData = () => {
            axios.get(`${process.env.REACT_APP_API_URL}/3/trending/all/week?api_key=${process.env.REACT_APP_API_KEY}`).then((res) => {
                setBanner(res.data.results[0]);
            });
        }
        getApiData();
    }, [])

    return (
        <>
            {
                bannerMovie == "" ?
                    <div className="flex justify-center">
                        <Oval
                            height="80"
                            width="80"
                            radius="9"
                            color="gray"
                            secondaryColor='gray'
                            ariaLabel="loading"
                        />
                    </div>
                    :
                    <div className={`h-[40vh] md:h-[60vh] bg-center bg-cover flex items-end `} style={{backgroundImage: `url(https://image.tmdb.org/t/p/original/t/p/original/${bannerMovie.backdrop_path})`}}>
                        <div className="text-xl md:text-3xltext-whitebg-gray-900 bg-opacity-60 p-4 text-center w-full">{bannerMovie.name}</div>
                    </div>
            }
        </>
    )
}

export default Banner;
'use client';

import { useState } from 'react';
import { Article } from '@/types';
import { useRouter } from 'next/router';

export default function Search({ placeholder }: { placeholder: string }) {
    let timeout: NodeJS.Timeout;
    const [searchTerm, setSearchTerm] = useState("");
    const [results, setResults] = useState<Article[]>([]);

    function handleSearch(term: string) {
        // console.log(term);

        // if (timeout) {
        //     clearTimeout(timeout);
        // }

        // timeout = setTimeout(() => {
        fetch(`/api/search`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ searchTerm: term }),
        })
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                setResults(data);
            });
        // }, 1000); 
    }

    return (
        <div className="relative flex flex-1 flex-shrink-0">
            <label htmlFor="search" className="sr-only">
                Search
            </label>
            <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                placeholder={placeholder}
                onChange={(e) => {
                    setSearchTerm(e.target.value);
                }}
            />
            <button onClick={(e) => {
                    handleSearch(searchTerm);
            }}>
                Search
            </button>
            <div>
                {results.map((result, index) => (
                    <div key={index}>{result.title}</div>
                ))}
            </div>
        </div>
    );
}
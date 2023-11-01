

SELECT title FROM movies
JOIN ratings on id = ratings.movie_id
WHERE movies.id in

    -- USING MOVIE ID GET THE ID OF THE TOP 5 RATED MOVIE
    (
    SELECT ratings.movie_id FROM ratings
    WHERE ratings.movie_id in
        --MOVIE ID THAT HE STARRED IN
        (
        SELECT stars.movie_id FROM stars, people
        WHERE stars.person_id = people.id
        AND stars.person_id in (SELECT people.id FROM people WHERE name = "Chadwick Boseman")
        )
    )

ORDER BY rating DESC
LIMIT 5;


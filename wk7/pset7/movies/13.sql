

SELECT name FROM people
WHERE people.id in
    (
    --GOT PEOPLE'S ID--
    SELECT person_id FROM stars
    WHERE movie_id in
        (
        --GOT MOVIE IDS--
        SELECT stars.movie_id FROM stars
        JOIN people ON person_id = people.id
        WHERE person_id = (SELECT id FROM people WHERE name = "Kevin Bacon" AND birth = "1958")
        )
    )
AND NOT people.id = (SELECT id FROM people WHERE name = "Kevin Bacon" AND birth = "1958")




--use his id --> find movie id he starred in --> other people_id who acted in THAT movie --> NAME from the people_id

SELECT name FROM people
WHERE id in

(SELECT stars.person_id FROM stars, movies
WHERE  movies.id = stars.movie_id
AND stars.movie_id in (SELECT id FROM movies WHERE year = 2004))

ORDER BY birth
LIMIT 10;

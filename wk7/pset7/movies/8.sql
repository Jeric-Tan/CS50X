SELECT name FROM people
WHERE id in
(SELECT stars.person_id FROM stars, movies
WHERE stars.movie_id = movies.id
AND stars.movie_id in (SELECT id FROM movies WHERE title = "Toy Story"))


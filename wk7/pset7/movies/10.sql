SELECT name FROM people
WHERE id in
(SELECT directors.person_id FROM directors, movies
WHERE directors.movie_id = movies.id
AND directors.movie_id in (SELECT ratings.movie_id FROM ratings WHERE rating >= 9.0));
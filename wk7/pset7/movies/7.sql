SELECT title, rating FROM movies, ratings
WHERE movies.id = ratings.movie_id
AND id in (SELECT id FROM movies WHERE year = 2010)
ORDER BY rating DESC, title ASC;
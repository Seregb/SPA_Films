import { useState, useEffect } from "react";
import Pagination from "../Pagination";
import "./index.css";

function Posts() {
  const [posts, setPosts] = useState([]);
  const [limit, setLimit] = useState(4);
  const [page, setPage] = useState(1);
  const [comment, setComment] = useState("");
  const offset = (page - 1) * limit;


  function fixLengthDescription(arr) {
    arr.map((el) => {
      const length = 420;
      const lastSymb = el.description_full.indexOf(" ", length);
      if (lastSymb > 0) {
        el.description_full =
          el.description_full.substring(
            0,
            lastSymb === -1 ? length : lastSymb
          ) + "...";
      }
      el.commentaries = [];
      el.input = '';
      return el;
    });
    return arr;
  }

  function commentHandler(e) {
    const { id } = e.target;
    posts.map((el) => {
      if (el.id == id) {
        el.commentaries.push(comment);
        if (el.commentaries.length > 4) {
          el.commentaries.shift();
        }
      }
      return el;
    });
    setPosts(posts);
    setComment("");
  }

  useEffect(() => {
    fetch("https://yts.mx/api/v2/list_movies.json")
      .then((res) => res.json())
      .then((data) => {
        const fixedPosts = fixLengthDescription(data.data.movies);
        console.log(fixedPosts);
        setPosts(fixedPosts);
      });
  }, []);

  return (
    <div className="container">
      <header>
        <h1>Фильмы</h1>
      </header>

      <label>
        Сколько фильмов на странице:&nbsp;
        <select
          type="number"
          value={limit}
          onChange={({ target: { value } }) => setLimit(Number(value))}
        >
          <option value="4">4</option>
          <option value="10">10</option>
          <option value="25">25</option>
          <option value="50">50</option>
        </select>
      </label>

      <main>
        {posts
          .slice(offset, offset + limit)
          .map(
            ({
              id,
              title,
              description_full,
              large_cover_image,
              url,
              commentaries,
              year,
              genres
            }) => (
              <div key={id} className="card">
                <h3>
                  <a href={url}>{title} {`(${year} / ${genres.map(el => el)})`}</a>
                </h3>
                <div className="textRange">
                  <a href={url}>
                    <img
                      src={large_cover_image}
                      className="img"
                      alt="poster"
                    ></img>
                  </a>
                  <div className="text">
                    <p>{description_full}</p>
                    <div className="commentBox">
                      {commentaries.map((el) => {
                        return <div className="comment">{el}</div>;
                      })}
                      <div className="inputDiv">
                        <input
                          id={id}
                          type="text"
                          placeholder="Оставить комментарий"
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                        />
                        <button id={id} onClick={commentHandler}>
                          Отправить
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          )}
      </main>

      <footer>
        <Pagination
          total={posts.length}
          limit={limit}
          page={page}
          setPage={setPage}
        />
      </footer>
    </div>
  );
}

export default Posts;

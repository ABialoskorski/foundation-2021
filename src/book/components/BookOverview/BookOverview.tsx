import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { Book } from "../../book";
import { useBookService } from "../../services/BooksService";
import { useQuery } from "react-query";

export interface Props {}

export const BookOverview = () => {
  const { findAll } = useBookService();
  // const [books, setBooks] = useState<Book[]>([]);
  const { push } = useHistory();

  // React Query
  const { isLoading, error, data } = useQuery<Book[], Error>("bookList", findAll);

  // // Apollo
  // const { data } = useQuery(GET_BOOKS, {
  //   fetchPolicy: 'network-only',
  //   onError: (error) => console.log(error),
  // });

  // useEffect(() => {
  //   findAll().then((books: Book[]) => {
  //     setBooks(books)
  //   })
  // }, []);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>An error has occurred: " + {error.message}</div>;

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-8 col-12">
          <table className="table table-hover">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Authors</th>
                <th scope="col">Title</th>
              </tr>
            </thead>
            <tbody>
              {data?.map((book, index) => (
                <tr
                  key={book.id}
                  onClick={() => push(`/book-app/book/${book.id}`)}
                >
                  <th scope="row">{index + 1}</th>
                  <td>{book.authors}</td>
                  <td>{book.title}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

import { BookService } from "./BooksService";
import { Book, BookProperties } from "../book";

const URI = `http://localhost:8081/`;
const headers = { "Content-Type": "application/json" };

export const useGraphqlBooks = () => {
  const findAll: BookService["findAll"] = () =>
    fetch(URI, {
      method: "POST",
      headers,
      body: JSON.stringify({ query: "{ allBooks { id authors title } }" }),
    })
      .then((response) => response.json())
      .then(({ data: { allBooks } }) => allBooks);

  const findOne: BookService["findOne"] = (id: number) =>
    fetch(URI, {
      method: "POST",
      headers,
      body: JSON.stringify({ query: `query Book($id: ID!){
       Book(id: $id) { id authors title } }`,
      variables: JSON.stringify({ id })
      })
    })
      .then((response) => response.json())
      .then(({ data: { Book } }) => Book);

  const save: BookService["save"] = ({
   id,
   authors,
   title,
   }: Book) =>
    fetch(URI, {
      method: "POST",
      headers,
      body: JSON.stringify({
        query: `mutation ($id: ID!, $authors: String $title: String) {
          updateBook(id: $id authors: $authors title: $title) {
            id
            authors
            title
          }
        }`,
        variables: JSON.stringify({
          id,
          authors,
          title,
        }),
      }),
    })
      .then((response) => response.json())
      .then(({ data: { createBook } }) => createBook);


  const saveNew: BookService["saveNew"] = ({
    authors,
    title,
  }: BookProperties) =>
    fetch(URI, {
      method: "POST",
      headers,
      body: JSON.stringify({
        query: `mutation ($authors: String! $title: String!) {
          createBook(authors: $authors title: $title) {
            id
            authors
            title
          }
        }`,
        variables: JSON.stringify({
          id: Math.floor(Math.random() * 100),
          authors,
          title,
        }),
      }),
    })
      .then((response) => response.json())
      .then(({ data: { createBook } }) => createBook);

  return {
    findAll,
    findOne,
    save,
    saveNew,
  };
};

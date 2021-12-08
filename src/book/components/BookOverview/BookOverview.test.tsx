import { render, screen, act, fireEvent } from "@testing-library/react";
import { createMemoryHistory } from "history";
import { Router } from "react-router-dom";
import { BookOverview } from "./BookOverview";
import { BookContext, BookService } from "../../services/BooksService";
import { Book } from "../../book";
import { getURI, useRemoteBooks } from '../../services/useRemoteBooks';

const mockedResponseBooks = [
  {
    id: 1,
    authors: "Julius Verne",
    title: "80 days around the world",
  },
  {
    id: 2,
    authors: "Joe Smith",
    title: "Another Book",
  },
] 

describe("Book Overview with HTTP", () => {
  
  const history = createMemoryHistory();

  beforeAll(() => jest.spyOn(window, 'fetch'))

  const Wrapper = ({ children }: any) => (
    <Router history={history}>
      <BookContext.Provider value={useRemoteBooks()}>
        {children}
      </BookContext.Provider>
    </Router>
  );

  test("Renders books table with data received from server", async () => {

    await (window.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => (mockedResponseBooks),
    })

    render(<BookOverview />, { wrapper: Wrapper });
    expect(await screen.findByText(/Julius Verne/i)).toBeInTheDocument()
  })

})

describe("Book Overview Component", () => {
  beforeAll(() => {
    jest.spyOn(console, "error").mockImplementation(() => {});
  });
  jest.useFakeTimers();
  const history = createMemoryHistory();
  let bookServiceMockPromise: Promise<Book[]>;
  const bookServiceMock = {
    findAll() {
      bookServiceMockPromise = Promise.resolve([
        {
          id: 1,
          authors: "John Example",
          title: "Example Book",
        },
        {
          id: 2,
          authors: "Joe Smith",
          title: "Another Book",
        },
      ]);
      return bookServiceMockPromise;
    },
  } as BookService;

  const Wrapper = ({ children }: any) => (
    <Router history={history}>
      <BookContext.Provider value={bookServiceMock}>
        {children}
      </BookContext.Provider>
    </Router>
  );

  it("renders the master table having three columns", () => {
    // given
    act(() => {
      render(<BookOverview />, { wrapper: Wrapper });
      jest.runAllTimers();
    });
    // when
    const noColumn = screen.getByText(/#/i);
    const authorsColumn = screen.getByText(/Authors/i);
    const titleColumn = screen.getByText(/Title/i);
    // then
    expect(noColumn).toBeInTheDocument();
    expect(authorsColumn).toBeInTheDocument();
    expect(titleColumn).toBeInTheDocument();
  });
  it("renders the master table rows", async () => {
    // given
    expect.hasAssertions();
    act(() => {
      render(<BookOverview />, { wrapper: Wrapper });
    });

    // when
    return bookServiceMockPromise.then(() => {
      const johnExamleRow = screen.getByText(/John Example/i);
      const joeSmithRow = screen.getByText(/Joe Smith/i);
      // then
      expect(johnExamleRow).toBeInTheDocument();
      expect(joeSmithRow).toBeInTheDocument();
    });
  });
  it("change path after row click", () => {
    // given
    history.push = jest.fn();
    act(() => {
      render(<BookOverview />, { wrapper: Wrapper });
      jest.runAllTimers();
    });
    // when
    return bookServiceMockPromise.then(() => {
      const row = screen.getByText(/John Example/i).closest("tr");
      row && fireEvent.click(row);
      expect(history.push).toHaveBeenCalled();
    });
  });
});

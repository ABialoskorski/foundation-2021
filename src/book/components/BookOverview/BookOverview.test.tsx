import { render, screen, act, fireEvent } from "@testing-library/react";
import { createMemoryHistory } from "history";
import { Router } from "react-router-dom";
import { BookOverview } from "./BookOverview";
import { BookContext, BookService } from "../../services/BooksService";
import { Book } from "../../book";
import * as reactRedux from 'react-redux'
import { Provider } from 'react-redux'
import { store } from "../../store/store";
import { mockBooks } from "../../../mocks/books"

describe("Book Overview Component", () => {
  beforeAll(() => {
    jest.spyOn(console, "error").mockImplementation(() => {});
  });
  jest.useFakeTimers();
  const history = createMemoryHistory();
  let bookServiceMockPromise: Promise<Book[]>;
  const bookServiceMock = {
    findAll() {
      bookServiceMockPromise = Promise.resolve(mockBooks);
      return bookServiceMockPromise;
    },
  } as BookService;

  const wrapper = ({ children }: any) => (
    <Provider store={store}>
      <Router history={history}>
        <BookContext.Provider value={bookServiceMock}>
          {children}
        </BookContext.Provider>
      </Router>
    </Provider>
  );

  it("renders the master table having three columns", () => {
    // given
    act(() => {
      render(<BookOverview />, { wrapper });
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
    act(() => {
      render(<BookOverview />, { wrapper });
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
      render(<BookOverview />, { wrapper });
      jest.runAllTimers();
    });
    // when
    return bookServiceMockPromise.then(() => {
      const row = screen.getByText(/John Example/i).closest("tr");
      row && fireEvent.click(row);
      expect(history.push).toHaveBeenCalled();
    });
  });


  describe("redux", () => {

    let useDispatchMock: jest.SpyInstance;

    beforeEach(() => {
      useDispatchMock = jest.spyOn(reactRedux, 'useDispatch');
    })

    afterEach(() => {
      useDispatchMock.mockClear();
    })

    it("gets books from store", () => {
      const mockDispatch = jest.fn();
      useDispatchMock.mockReturnValue(mockDispatch);
      // given
      act(() => {
        render(<BookOverview />, { wrapper });
        jest.runAllTimers();
      });
  
      return bookServiceMockPromise.then(() => {
        expect(mockDispatch).toHaveBeenCalled();
        expect(mockDispatch).toHaveBeenCalledTimes(1);
        expect(mockDispatch).toHaveBeenCalledWith({ type: 'UPDATE_BOOKS', payload: mockBooks });
      })
  
    });
  })


});

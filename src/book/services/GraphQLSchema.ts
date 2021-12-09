import { gql } from '@apollo/client';

export const GET_BOOKS = gql`
    query {
        allBooks {
            id
            authors
            title
        } 
    }
`;

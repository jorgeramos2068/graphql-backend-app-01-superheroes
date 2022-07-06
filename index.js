import { gql } from 'apollo-server';

const superheroes = [
  {
    id: 'id-00001',
    name: 'Superman',
    phone: '1800-0000001',
    street: 'Fake Street 001',
    city: 'Madrid',
  },
  {
    id: 'id-00002',
    name: 'Batman',
    phone: '1800-0000002',
    street: 'Fake Street 002',
    city: 'Barcelona',
  },
  {
    id: 'id-00003',
    name: 'Spiderman',
    phone: '1800-0000002',
    street: 'Fake Street 002',
    city: 'Mexico City',
  },
];

const typeDefinitions = gql`
  type Superhero {
    id: ID!
    name: String!
    phone: String
    street: String!
    city: String!
  }

  type Query {
    superheroCount: Int!
    allSuperheroes: [Superhero]!
  }
`;

const resolvers = {
  Query: {
    superheroCount: () => superheroes.length,
    allSuperheroes: () => superheroes,
  },
};

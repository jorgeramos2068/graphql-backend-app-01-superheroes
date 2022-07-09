import { ApolloServer, UserInputError, gql } from 'apollo-server';
import axios from 'axios';
import { v1 as uuid } from 'uuid';

const typeDefinitions = gql`
  enum YesNo {
    YES
    NO
  }

  type Address {
    street: String!
    city: String!
  }

  type Superhero {
    id: ID!
    name: String!
    phone: String
    address: Address!
  }

  type Query {
    superheroCount: Int!
    allSuperheroes(phone: YesNo): [Superhero]!
    findSuperhero(id: ID!): Superhero
  }

  type Mutation {
    addSuperhero(
      name: String!
      phone: String
      street: String!
      city: String!
    ): Superhero
    editSuperhero(
      id: ID!
      name: String!
      phone: String
      street: String!
      city: String!
    ): Superhero
  }
`;

const resolvers = {
  Query: {
    superheroCount: async () => {
      try {
        const { data: superheroes } = await axios.get(
          'http://localhost:3000/superheroes'
        );
        return superheroes.length;
      } catch (err) {
        console.error(err);
        return 0;
      }
    },
    allSuperheroes: async (root, args) => {
      try {
        const { data: superheroes } = await axios.get(
          'http://localhost:3000/superheroes'
        );
        if (!args.phone) {
          return superheroes;
        }
        return superheroes.filter(superhero =>
          args.phone === 'YES' ? superhero.phone : !superhero.phone
        );
      } catch (err) {
        console.error(err);
        return null;
      }
    },
    findSuperhero: async (root, args) => {
      const { id } = args;
      try {
        const { data: superheroe } = await axios.get(
          `http://localhost:3000/superheroes/${id}`
        );
        return superheroe;
      } catch (err) {
        console.error(err);
        return null;
      }
    },
  },
  Mutation: {
    addSuperhero: async (root, args) => {
      try {
        const superhero = { ...args, id: uuid() };
        await axios.post('http://localhost:3000/superheroes', superhero);
        return superhero;
      } catch (err) {
        console.error(err);
        return null;
      }
    },
    editSuperhero: async (root, updatedSuperhero) => {
      try {
        const { id, ...otherFields } = updatedSuperhero;
        await axios.put(`http://localhost:3000/superheroes/${id}`, otherFields);
        return updatedSuperhero;
      } catch (err) {
        console.error(err);
        return null;
      }
    },
  },
  Superhero: {
    address: root => {
      return {
        street: root.street,
        city: root.city,
      };
    },
  },
};

const server = new ApolloServer({ typeDefs: typeDefinitions, resolvers });
server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`);
});

import { ApolloServer, UserInputError, gql } from 'apollo-server';
import { v1 as uuid } from 'uuid';

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
    street: 'Fake Street 002',
    city: 'Mexico City',
  },
];

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
    findSuperhero(name: String!): Superhero
  }

  type Mutation {
    addSuperhero(
      name: String!
      phone: String
      street: String!
      city: String!
    ): Superhero
    editNumber(name: String!, phone: String!): Superhero
  }
`;

const resolvers = {
  Query: {
    superheroCount: () => superheroes.length,
    allSuperheroes: (root, args) => {
      if (!args.phone) {
        return superheroes;
      }
      return superheroes.filter(superhero =>
        args.phone === 'YES' ? superhero.phone : !superhero.phone
      );
    },
    findSuperhero: (root, args) => {
      const { name } = args;
      return superheroes.find(superhero => superhero.name === name);
    },
  },
  Mutation: {
    addSuperhero: (root, args) => {
      if (superheroes.find(element => element.name === args.name)) {
        throw new UserInputError('Name must be unique', {
          invalidArgs: args.name,
        });
      }
      const superhero = { ...args, id: uuid() };
      superheroes.push(superhero);
      return superhero;
    },
    editNumber: (root, args) => {
      const index = superheroes.findIndex(
        element => element.name === args.name
      );
      if (!index === -1) {
        return null;
      }
      const superhero = superheroes[index];
      const updated = { ...superhero, phone: args.phone };
      superheroes[index] = updated;
      return updated;
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

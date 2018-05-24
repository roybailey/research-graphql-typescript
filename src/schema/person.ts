import {
    GraphQLID,
    GraphQLEnumType,
    GraphQLInterfaceType,
    GraphQLObjectType,
    GraphQLList,
    GraphQLNonNull,
    GraphQLSchema,
    GraphQLString,
    GraphQLInt
} from 'graphql';

import { getPeople, addPerson, removePerson, PersonModel } from '../db/people';

const PersonRoleEnum = new GraphQLEnumType({
    name: 'PersonRole',
    description: 'Types of roles',
    values: {
        DIRECTED: {
            value: 'DIRECTED',
            description: 'Director',
        },
        ACTED_IN: {
            value: 'ACTED_IN',
            description: 'Actor',
        },
        PRODUCED: {
            value: 'PRODUCED',
            description: 'Producer',
        },
        WROTE: {
            value: 'WROTE',
            description: 'Wrote',
        },
    }
});

const PersonType = new GraphQLObjectType({
    name: 'Person',
    description: 'Person',
    fields: () => ({
        _id: {
            type: GraphQLID,
            description: 'identity',
        },
        name: {
            type: GraphQLString,
            description: 'Persons name',
        },
        born: {
            type: GraphQLInt,
            description: 'Year of birth',
        },
        roles: {
            type: new GraphQLList(PersonRoleEnum),
            description: 'Roles the person has played',
        },
    }),
});

const query = {
    people: {
        type: new GraphQLList(PersonType),
        args: {
            limit: {
                description: 'limit items in the results',
                type: GraphQLInt
            }
        },
        resolve: (root, { limit }) => getPeople(limit)
    },
};

const mutation = {
    addPerson: {
        type: PersonType,
        args: {
            name: {
                type: GraphQLString
            },
            description: {
                type: GraphQLString
            },
            born: {
                type: GraphQLInt
            },
        },
        resolve: (obj, input) => addPerson(input)
    },
    removePerson: {
        type: GraphQLID,
        args: {
            id: {
                type: GraphQLID
            },
        },
        resolve: (obj, input) => removePerson(obj, input)
    },
};

const subscription = {

};

export const PersonSchema = {
    query,
    mutation,
    subscription,
    types: [PersonType]
};

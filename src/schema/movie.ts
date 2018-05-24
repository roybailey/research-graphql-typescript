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

import { getMovies } from '../db/movies';

const movieType = new GraphQLObjectType({
    name: 'Movie',
    description: 'Movie',
    fields: () => ({
        _id: {
            type: GraphQLID,
            description: 'identity',
        },
        title: {
            type: GraphQLString,
            description: 'The movie title',
        },
        tagline: {
            type: GraphQLString,
            description: 'The tagline',
        },
        released: {
            type: GraphQLInt,
            description: 'The release year',
        },
    }),
});

const query = {
    movies: {
        type: new GraphQLList(movieType),
        args: {
            limit: {
                description: 'limit items in the results',
                type: GraphQLInt
            }
        },
        resolve: (root, { limit }) => getMovies(limit)
    },
};

const mutation = {

};

const subscription = {

};

export const MovieSchema = {
    query,
    mutation,
    subscription,
    types: [movieType]
};

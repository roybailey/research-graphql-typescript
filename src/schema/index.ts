import {
    GraphQLSchema,
    GraphQLObjectType,
} from 'graphql';

// Import each models schema
import { UserSchema } from './user';
import { PersonSchema } from './person';
import { MovieSchema } from './movie';

export const graphqlSchema = new GraphQLSchema({
    query: new GraphQLObjectType({
        name: 'Query',
        fields: () => Object.assign(
            UserSchema.query,
            PersonSchema.query,
            MovieSchema.query,
        )
    }),
    mutation: new GraphQLObjectType({
        name: 'Mutation',
        fields: () => Object.assign(
            UserSchema.mutation,
            PersonSchema.mutation,
        )
    }),
    // subscription: new GraphQLObjectType({
    //     name: 'Subscription',
    //     fields: () => Object.assign(
    //         UserSchema.subscription,
    //         ProductSchema.subscription,
    //     )
    // }),
    types: [
        ...PersonSchema.types,
        ...UserSchema.types,
    ]
});

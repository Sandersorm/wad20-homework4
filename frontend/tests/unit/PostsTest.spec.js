import {mount, createLocalVue} from '@vue/test-utils'
import Vuex from 'vuex'
import VueRouter from 'vue-router'
import Posts from "../../src/components/Posts.vue";

const localVue = createLocalVue();

localVue.use(Vuex);
localVue.use(VueRouter);

//Create dummy store
const store = new Vuex.Store({
    state: {
        user: {
            id: 1,
            firstname: 'test',
            lastname: 'test',
            email: 'test',
            avatar: 'test',
        }
    },
    getters: {
        user: (state) => state.user,
    }
});

//Create dummy routes
const routes = [
    {
        path: '/',
        name: 'posts',
    },
    {
        path: '/profiles',
        name: 'profiles'
    }
];

const router = new VueRouter({routes});

const testData = [
    {
        id: 1,
        text: "I think it's going to rain",
        createTime: "2020-12-05 13:53:23",
        likes: 0,
        liked: false,
        media: {
            url: "test-image.jpg",
            type: "image"
        },
        author: {
            id: 2,
            firstname: "Gordon",
            lastname: "Freeman",
            avatar: 'avatar.url'
        }
    },
    {
        id: 2,
        text: "Which weighs more, a pound of feathers or a pound of bricks?",
        createTime: "2020-12-05 13:53:23",
        likes: 1,
        liked: true,
        media: null,
        author: {
            id: 3,
            firstname: "Sarah",
            lastname: "Connor",
            avatar: 'avatar.url'
        }
    },
    {
        id: 4,
        text: null,
        createTime: "2020-12-05 13:53:23",
        likes: 3,
        liked: false,
        media: {
            url: "test-video.mp4",
            type: "video"
        },
        author: {
            id: 5,
            firstname: "Richard",
            lastname: "Stallman",
            avatar: 'avatar.url'
        }
    }
];

//Mock axios.get method that our Component calls in mounted event
jest.mock("axios", () => ({
    get: () => Promise.resolve({
        data: testData
    })
}));

describe('Posts', () => {

    const wrapper = mount(Posts, {router, store, localVue});

    it('renders correct amount of posts', function () {
        const posts = wrapper.findAll('.post')
        expect(posts.length).toBe(testData.length)
    });

    it('renders correct amount of images', function () {
        const wrapperImages = wrapper.findAll('.image-content')
        const testDataImages = testData.filter(post => post.media && post.media.type === 'image')
        expect(wrapperImages.length).toBe(testDataImages.length)
    });

    it('renders correct amount of videos', function () {
        const wrapperVideos = wrapper.findAll('.video-content')
        const testDataVideos = testData.filter(post => post.media && post.media.type === 'video')
        expect(wrapperVideos.length).toBe(testDataVideos.length)
    });

    it('renders correct amount of null media contents', function () {
        const wrapperPosts = wrapper.findAll('.post')
        const wrapperVideos = wrapper.findAll('.video-content')
        const wrapperImages = wrapper.findAll('.image-content')
        const wrapperNullMediaCount = wrapperPosts.length - wrapperImages.length - wrapperVideos.length
        const testDataNullMedia = testData.filter(post => !post.media)
        expect(wrapperNullMediaCount).toBe(testDataNullMedia.length)
    });


    it('renders dates with correct format', function () {
        const wrapperPosts = wrapper.findAll('.post')
        const timeFormat = wrapperPosts.at(1).find(".time-content").text()
        expect(timeFormat).toBe("Saturday, December 5, 2020 1:53 PM")
    })
});
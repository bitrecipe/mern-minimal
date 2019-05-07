import Header from "./../../components/Header.js";

describe('Header rendering', () => {
    const session = {
        email: 'test@test.com',
    };

    const wrapper = shallow(<Header session={session} />);

    it('should render one <nav>', () => {
        const nav = wrapper.find('nav');
        expect(nav.length).toBe(1);
    });

    it('should show MERN minimal', () => {
        expect(wrapper.text().includes('MERN minimal')).toBe(true);
    });

});
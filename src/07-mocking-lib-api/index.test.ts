// Uncomment the code below and write your tests
import { throttledGetDataFromApi } from './index';

jest.mock('axios');
const mockedAxios = require('axios');

describe('throttledGetDataFromApi', () => {
  beforeEach(() => {
    mockedAxios.create = jest.fn().mockReturnValue({
      defaults: { baseURL: 'https://jsonplaceholder.typicode.com' },
      get: jest.fn().mockImplementation((url) => {
      
        if (url === '/posts/1') {
          return Promise.resolve({ data: { id: 1, title: 'Test Post' } });
        }
        return Promise.reject(new Error('Not Found'));
      }),
    });

    mockedAxios.get.mockClear();
  });

  it('should perform request to the correct provided url', async () => {
    const relativePath = '/posts/1';

    const data = await throttledGetDataFromApi(relativePath);
    expect(mockedAxios.create().get).toHaveBeenCalledWith(relativePath);
    expect(data).toEqual({ id: 1, title: 'Test Post' });
  });

  test('should return response data', async () => {
    const relativePath = '/posts/1';
    const responseData = { id: 1, title: 'Test Post' };
    mockedAxios.get.mockResolvedValueOnce({ data: responseData });

    const data = await throttledGetDataFromApi(relativePath);
    expect(data).toEqual(responseData);
  });
});

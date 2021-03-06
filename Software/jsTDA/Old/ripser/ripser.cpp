//#define ASSEMBLE_REDUCTION_MATRIX
//#define USE_COEFFICIENTS

//#define INDICATE_PROGRESS
//#define PRINT_PERSISTENCE_PAIRS

#define FILE_FORMAT_LOWER_TRIANGULAR_CSV
//#define FILE_FORMAT_UPPER_TRIANGULAR_CSV
//#define FILE_FORMAT_DIPHA

//#define USE_GOOGLE_HASHMAP

#include <algorithm>
#include <iostream>
#include <fstream>
#include <cassert>
#include <queue>
#include <unordered_map>
#include <emscripten/bind.h>

using namespace emscripten;

#ifdef USE_GOOGLE_HASHMAP
#include <sparsehash/sparse_hash_map>
template <class Key, class T> class hash_map : public google::sparse_hash_map<Key, T> {
public:
	inline void reserve(size_t hint) { this->resize(hint); }
};
#else
template <class Key, class T> class hash_map : public std::unordered_map<Key, T> {};
#endif

typedef float value_t;
// typedef uint16_t value_t;

typedef long index_t;
typedef long coefficient_t;

class binomial_coeff_table {
	std::vector<std::vector<index_t>> B;
	index_t n_max, k_max;

public:
	binomial_coeff_table(index_t n, index_t k) {
		n_max = n;
		k_max = k;

		B.resize(n + 1);
		for (index_t i = 0; i <= n; i++) {
			B[i].resize(k + 1);
			for (index_t j = 0; j <= std::min(i, k); j++) {
				if (j == 0 || j == i)
					B[i][j] = 1;
				else
					B[i][j] = B[i - 1][j - 1] + B[i - 1][j];
			}
		}
	}

	index_t operator()(index_t n, index_t k) const {
		assert(n <= n_max);
		assert(k <= k_max);
		return B[n][k];
	}
};

std::vector<coefficient_t> multiplicative_inverse_vector(const coefficient_t m) {
	std::vector<coefficient_t> inverse(m);
	inverse[1] = 1;
	// m = a * (m / a) + m % a
	// Multipying with inverse(a) * inverse(m % a):
	// 0 = (m / a) * inverse(m % a) + inverse(a)  (mod m)
	for (coefficient_t a = 2; a < m; ++a) inverse[a] = m - ((m / a) * inverse[m % a]) % m;
	return inverse;
}

template <typename OutputIterator>
OutputIterator get_simplex_vertices(index_t idx, const index_t dim, index_t n,
                                    const binomial_coeff_table& binomial_coeff,
                                    OutputIterator out) {
	--n;

	for (index_t k = dim + 1; k > 0; --k) {
		if (binomial_coeff(n, k) > idx) {
			index_t count = n;
			while (count > 0) {
				index_t i = n;
				index_t step = count >> 1;
				i -= step;
				if (binomial_coeff(i, k) > idx) {
					n = --i;
					count -= step + 1;
				} else
					count = step;
			}
		}
		assert(binomial_coeff(n, k) <= idx);
		assert(binomial_coeff(n + 1, k) > idx);

		*out++ = n;
		idx -= binomial_coeff(n, k);
	}

	return out;
}

std::vector<index_t> vertices_of_simplex(const index_t simplex_index, const index_t dim,
                                         const index_t n,
                                         const binomial_coeff_table& binomial_coeff) {
	std::vector<index_t> vertices;
	get_simplex_vertices(simplex_index, dim, n, binomial_coeff, std::back_inserter(vertices));
	return vertices;
}

#ifdef USE_COEFFICIENTS
struct entry_t {
	index_t index;
	coefficient_t coefficient;
	entry_t(index_t _index, coefficient_t _coefficient)
	    : index(_index), coefficient(_coefficient) {}
	entry_t(index_t _index) : index(_index), coefficient(1) {}
	entry_t() : index(0), coefficient(1) {}
};

entry_t make_entry(index_t _index, coefficient_t _coefficient) {
	return entry_t(_index, _coefficient);
}
index_t get_index(entry_t e) { return e.index; }
index_t get_coefficient(entry_t e) { return e.coefficient; }
void set_coefficient(entry_t& e, const coefficient_t c) { e.coefficient = c; }

bool operator==(const entry_t& e1, const entry_t& e2) {
	return get_index(e1) == get_index(e2) && get_coefficient(e1) == get_coefficient(e2);
}

std::ostream& operator<<(std::ostream& stream, const entry_t& e) {
	stream << get_index(e) << ":" << get_coefficient(e);
	return stream;
}

#else

typedef index_t entry_t;
const index_t get_index(entry_t i) { return i; }
index_t get_coefficient(entry_t i) { return 1; }
entry_t make_entry(index_t _index, coefficient_t _value) { return entry_t(_index); }
void set_coefficient(index_t& e, const coefficient_t c) { e = c; }

#endif

const entry_t& get_entry(const entry_t& e) { return e; }

template <typename Entry> struct smaller_index {
	bool operator()(const Entry& a, const Entry& b) { return get_index(a) < get_index(b); }
};

typedef std::pair<value_t, index_t> diameter_index_t;
value_t get_diameter(diameter_index_t i) { return i.first; }
index_t get_index(diameter_index_t i) { return i.second; }

class diameter_entry_t : public std::pair<value_t, entry_t> {
public:
	diameter_entry_t(std::pair<value_t, entry_t> p) : std::pair<value_t, entry_t>(p) {}
	diameter_entry_t(entry_t e) : std::pair<value_t, entry_t>(0, e) {}
	diameter_entry_t() : diameter_entry_t(0) {}
};

const entry_t& get_entry(const diameter_entry_t& p) { return p.second; }
entry_t& get_entry(diameter_entry_t& p) { return p.second; }
const index_t get_index(const diameter_entry_t& p) { return get_index(get_entry(p)); }
const coefficient_t get_coefficient(const diameter_entry_t& p) {
	return get_coefficient(get_entry(p));
}
const value_t& get_diameter(const diameter_entry_t& p) { return p.first; }
void set_coefficient(diameter_entry_t& p, const coefficient_t c) {
	set_coefficient(get_entry(p), c);
}
diameter_entry_t make_diameter_entry(value_t _diameter, index_t _index,
                                     coefficient_t _coefficient) {
	return std::make_pair(_diameter, make_entry(_index, _coefficient));
}
diameter_entry_t make_diameter_entry(diameter_index_t _diameter_index, coefficient_t _coefficient) {
	return std::make_pair(get_diameter(_diameter_index),
	                      make_entry(get_index(_diameter_index), _coefficient));
}

template <typename Entry> struct greater_diameter_or_smaller_index {
	bool operator()(const Entry& a, const Entry& b) {
		return (get_diameter(a) > get_diameter(b)) ||
		       ((get_diameter(a) == get_diameter(b)) && (get_index(a) < get_index(b)));
	}
};

template <typename DistanceMatrix> class rips_filtration_comparator {
public:
	const DistanceMatrix& dist;
	const index_t dim;

private:
	mutable std::vector<index_t> vertices;
	const binomial_coeff_table& binomial_coeff;

public:
	rips_filtration_comparator(const DistanceMatrix& _dist, const index_t _dim,
	                           const binomial_coeff_table& _binomial_coeff)
	    : dist(_dist), dim(_dim), vertices(_dim + 1), binomial_coeff(_binomial_coeff){};

	value_t diameter(const index_t index) const {
		value_t diam = 0;
		get_simplex_vertices(index, dim, dist.size(), binomial_coeff, vertices.begin());

		for (index_t i = 0; i <= dim; ++i)
			for (index_t j = 0; j < i; ++j) {
				diam = std::max(diam, dist(vertices[i], vertices[j]));
			}
		return diam;
	}

	bool operator()(const index_t a, const index_t b) const {
		assert(a < binomial_coeff(dist.size(), dim + 1));
		assert(b < binomial_coeff(dist.size(), dim + 1));

		value_t a_diam = 0, b_diam = diameter(b);

		get_simplex_vertices(a, dim, dist.size(), binomial_coeff, vertices.begin());
		for (index_t i = 0; i <= dim; ++i)
			for (index_t j = i + 1; j <= dim; ++j) {
				a_diam = std::max(a_diam, dist(vertices[i], vertices[j]));
				if (a_diam > b_diam) return true;
			}

		return (a_diam == b_diam) && (a < b);
	}

	template <typename Entry> bool operator()(const Entry& a, const Entry& b) const {
		return operator()(get_index(a), get_index(b));
	}
};

class simplex_coboundary_enumerator {
private:
	index_t idx, modified_idx, dim, v, k;
	const binomial_coeff_table& binomial_coeff;

public:
	simplex_coboundary_enumerator(index_t _idx, index_t _dim, index_t _n,
	                              const binomial_coeff_table& _binomial_coeff)
	    : idx(_idx), modified_idx(_idx), dim(_dim), k(dim + 1), v(_n - 1),
	      binomial_coeff(_binomial_coeff) {}

	bool has_next() {
		while ((v != -1) && (binomial_coeff(v, k) <= idx)) {
			idx -= binomial_coeff(v, k);
			modified_idx += binomial_coeff(v, k + 1) - binomial_coeff(v, k);
			--v;
			--k;
			assert(k != -1);
		}
		return v != -1;
	}

	std::pair<entry_t, index_t> next() {
		auto result =
		    std::make_pair(make_entry(modified_idx + binomial_coeff(v, k + 1), k & 1 ? -1 : 1), v);
		--v;
		return result;
	}
};

class distance_matrix {
public:
	typedef value_t value_type;
	std::vector<std::vector<value_t>> distances;
	value_t operator()(const index_t a, const index_t b) const { return distances[a][b]; }

	size_t size() const { return distances.size(); }
};

enum compressed_matrix_layout { LOWER_TRIANGULAR, UPPER_TRIANGULAR };

template <compressed_matrix_layout Layout> class compressed_distance_matrix_adapter {
public:
	typedef value_t value_type;
	std::vector<value_t>& distances;
	std::vector<value_t*> rows;

	void init_distances() { distances.resize(size() * (size() - 1) / 2); }

	void init_rows();

	compressed_distance_matrix_adapter(std::vector<value_t>& _distances)
	    : distances(_distances), rows((1 + std::sqrt(1 + 8 * _distances.size())) / 2) {
		assert(distances.size() == size() * (size() - 1) / 2);
		init_rows();
	}

	template <typename DistanceMatrix>
	compressed_distance_matrix_adapter(std::vector<value_t>& _distances, const DistanceMatrix& mat)
	    : distances(_distances), rows(mat.size()) {
		init_distances();
		init_rows();

		for (index_t i = 1; i < size(); ++i) {
			for (index_t j = 0; j < i; ++j) { rows[i][j] = mat(i, j); }
		}
	}

	value_t operator()(const index_t i, const index_t j) const;

	size_t size() const { return rows.size(); }
};

template <> void compressed_distance_matrix_adapter<LOWER_TRIANGULAR>::init_rows() {
	value_t* pointer = &distances[0];
	for (index_t i = 1; i < size(); ++i) {
		rows[i] = pointer;
		pointer += i;
	}
}

template <> void compressed_distance_matrix_adapter<UPPER_TRIANGULAR>::init_rows() {
	value_t* pointer = &distances[0] - 1;
	for (index_t i = 0; i < size() - 1; ++i) {
		rows[i] = pointer;
		pointer += size() - i - 2;
	}
}

template <>
value_t compressed_distance_matrix_adapter<UPPER_TRIANGULAR>::operator()(const index_t i,
                                                                         const index_t j) const {
	if (i < j)
		return rows[i][j];
	else if (i > j)
		return rows[j][i];
	else
		return 0;
}

template <>
value_t compressed_distance_matrix_adapter<LOWER_TRIANGULAR>::operator()(const index_t i,
                                                                         const index_t j) const {
	if (i > j)
		return rows[i][j];
	else if (i < j)
		return rows[j][i];
	else
		return 0;
}

typedef compressed_distance_matrix_adapter<LOWER_TRIANGULAR>
    compressed_lower_distance_matrix_adapter;
typedef compressed_distance_matrix_adapter<UPPER_TRIANGULAR>
    compressed_upper_distance_matrix_adapter;

template <typename Heap> diameter_entry_t pop_pivot(Heap& column, coefficient_t modulus) {
	if (column.empty())
		return diameter_entry_t(-1);
	else {
		auto pivot = column.top();

#ifdef USE_COEFFICIENTS
		coefficient_t coefficient = 0;
		do {
			coefficient = (coefficient + get_coefficient(column.top())) % modulus;
			column.pop();

			if (coefficient == 0) {
				if (column.empty())
					return diameter_entry_t(-1);
				else
					pivot = column.top();
			}
		} while (!column.empty() && get_index(column.top()) == get_index(pivot));
		if (get_index(pivot) != -1) { set_coefficient(pivot, coefficient); }
#else
		column.pop();
		while (!column.empty() && get_index(column.top()) == get_index(pivot)) {
			column.pop();
			if (column.empty())
				return diameter_entry_t(-1);
			else {
				pivot = column.top();
				column.pop();
			}
		}
#endif
		return pivot;
	}
}

template <typename Heap> diameter_entry_t get_pivot(Heap& column, coefficient_t modulus) {
	diameter_entry_t result = pop_pivot(column, modulus);
	if (get_index(result) != -1) column.push(result);
	return result;
}

template <typename Comparator>
void assemble_columns_to_reduce(std::vector<diameter_index_t>& columns_to_reduce,
                                hash_map<index_t, index_t>& pivot_column_index,
                                const Comparator& comp, index_t dim, index_t n, value_t threshold,
                                const binomial_coeff_table& binomial_coeff) {
	index_t num_simplices = binomial_coeff(n, dim + 2);

	columns_to_reduce.clear();

#ifdef INDICATE_PROGRESS
	std::cout << "\033[K"
	          << "assembling " << num_simplices << " columns" << std::flush << "\r";
#endif

	for (index_t index = 0; index < num_simplices; ++index) {
		if (pivot_column_index.find(index) == pivot_column_index.end()) {
			value_t diameter = comp.diameter(index);
			if (diameter <= threshold) columns_to_reduce.push_back(std::make_pair(diameter, index));
		}
	}

#ifdef INDICATE_PROGRESS
	std::cout << "\033[K"
	          << "sorting " << num_simplices << " columns" << std::flush << "\r";
#endif

	std::sort(columns_to_reduce.begin(), columns_to_reduce.end(),
	          greater_diameter_or_smaller_index<diameter_index_t>());
#ifdef INDICATE_PROGRESS
	std::cout << "\033[K";
#endif
}

template <typename ValueType> class compressed_sparse_matrix {
public:
	std::vector<size_t> bounds;
	std::vector<ValueType> entries;

	size_t size() const { return bounds.size(); }

	typename std::vector<ValueType>::const_iterator cbegin(size_t index) const {
		assert(index < size());
		return index == 0 ? entries.cbegin() : entries.cbegin() + bounds[index - 1];
	}

	typename std::vector<ValueType>::const_iterator cend(size_t index) const {
		assert(index < size());
		return entries.cbegin() + bounds[index];
	}

	template <typename Iterator> void append(Iterator begin, Iterator end) {
		for (Iterator it = begin; it != end; ++it) { entries.push_back(*it); }
		bounds.push_back(entries.size());
	}

	void append() { bounds.push_back(entries.size()); }

	void push_back(ValueType e) {
		assert(0 < size());
		entries.push_back(e);
		++bounds.back();
	}

	void pop_back() {
		assert(0 < size());
		entries.pop_back();
		--bounds.back();
	}

	template <typename Collection> void append(const Collection collection) {
		append(collection.cbegin(), collection.cend());
	}
};

template <typename Heap>
void push_entry(Heap& column, index_t i, coefficient_t c, value_t diameter) {
	entry_t e = make_entry(i, c);
	column.push(std::make_pair(diameter, e));
}

template <typename DistanceMatrix, typename ComparatorCofaces, typename Comparator>
void compute_pairs(std::vector<diameter_index_t>& columns_to_reduce,
                   hash_map<index_t, index_t>& pivot_column_index, const DistanceMatrix& dist,
                   const ComparatorCofaces& comp, const Comparator& comp_prev, index_t dim,
                   index_t n, value_t threshold, coefficient_t modulus,
                   const std::vector<coefficient_t>& multiplicative_inverse,
                   const binomial_coeff_table& binomial_coeff, 
                   std::vector<float>& births, std::vector<float>& deaths) {

#ifdef PRINT_PERSISTENCE_PAIRS
	std::cout << "persistence intervals in dim " << dim << ":" << std::endl;
#endif

#ifdef ASSEMBLE_REDUCTION_MATRIX
	compressed_sparse_matrix<diameter_entry_t> reduction_matrix;
#else
#ifdef USE_COEFFICIENTS
	std::vector<diameter_entry_t> reduction_coefficients;
#endif
#endif

	std::vector<diameter_entry_t> coface_entries;
	std::vector<index_t> vertices;

	for (index_t i = 0; i < columns_to_reduce.size(); ++i) {
		auto column_to_reduce = columns_to_reduce[i];

#ifdef ASSEMBLE_REDUCTION_MATRIX
		std::priority_queue<diameter_entry_t, std::vector<diameter_entry_t>,
		                    smaller_index<diameter_entry_t>> reduction_column;
#endif

		std::priority_queue<diameter_entry_t, std::vector<diameter_entry_t>,
		                    greater_diameter_or_smaller_index<diameter_entry_t>> working_coboundary;

		value_t diameter = get_diameter(column_to_reduce);

#ifdef INDICATE_PROGRESS
		if ((i + 1) % 1000 == 0)
			std::cout << "\033[K"
			          << "reducing column " << i + 1 << "/" << columns_to_reduce.size()
			          << " (diameter " << diameter << ")" << std::flush << "\r";
#endif

		index_t j = i;
		auto column_to_add = column_to_reduce;

		// start with a dummy pivot entry with coefficient -1 in order to initialize
		// working_coboundary with the coboundary of the simplex with index column_to_reduce
		diameter_entry_t pivot = make_diameter_entry(0, -1, -1 + modulus);

#ifdef ASSEMBLE_REDUCTION_MATRIX
		reduction_matrix.append();
#endif

#ifdef ASSEMBLE_REDUCTION_MATRIX
		// initialize reduction_matrix as identity matrix
		reduction_matrix.push_back(make_diameter_entry(column_to_reduce, 1));
#else
#ifdef USE_COEFFICIENTS
		reduction_coefficients.push_back(make_diameter_entry(column_to_reduce, 1));
#endif
#endif

		bool might_be_apparent_pair = true;

		do {
			const coefficient_t factor = modulus - get_coefficient(pivot);

#ifdef ASSEMBLE_REDUCTION_MATRIX
			for (auto it = reduction_matrix.cbegin(j); it != reduction_matrix.cend(j); ++it)
#endif
			{
#ifdef ASSEMBLE_REDUCTION_MATRIX
				const auto& simplex = *it;
				coefficient_t simplex_coefficient = get_coefficient(simplex);
				simplex_coefficient *= factor;
				simplex_coefficient %= modulus;
#else
#ifdef USE_COEFFICIENTS
				const auto& simplex = reduction_coefficients[j];
#else
				const auto& simplex = column_to_add;
#endif
#endif
				value_t simplex_diameter = get_diameter(simplex);
				assert(simplex_diameter == comp_prev.diameter(get_index(simplex)));

#ifdef ASSEMBLE_REDUCTION_MATRIX
				reduction_column.push(
				    make_diameter_entry(simplex_diameter, get_index(simplex), simplex_coefficient));
#endif

				vertices.clear();
				get_simplex_vertices(get_index(simplex), dim, n, binomial_coeff,
				                     std::back_inserter(vertices));

				coface_entries.clear();
				simplex_coboundary_enumerator cofaces(get_index(simplex), dim, n, binomial_coeff);
				while (cofaces.has_next()) {
					auto coface_descriptor = cofaces.next();
					entry_t coface = coface_descriptor.first;
					index_t covertex = coface_descriptor.second;
					index_t coface_index = get_index(coface);
					value_t coface_diameter = simplex_diameter;
					for (index_t v : vertices) {
						coface_diameter = std::max(coface_diameter, dist(v, covertex));
					}
					assert(comp.diameter(coface_index) == coface_diameter);

					if (coface_diameter <= threshold) {
						coefficient_t coface_coefficient =
						    get_coefficient(coface) * get_coefficient(simplex) * factor;
						coface_coefficient %= modulus;
						if (coface_coefficient < 0) coface_coefficient += modulus;
						assert(coface_coefficient >= 0);

						diameter_entry_t coface_entry =
						    make_diameter_entry(coface_diameter, coface_index, coface_coefficient);
						coface_entries.push_back(coface_entry);

						if (might_be_apparent_pair && (simplex_diameter == coface_diameter)) {
							if (pivot_column_index.find(coface_index) == pivot_column_index.end()) {
								pivot = coface_entry;
								goto found_persistence_pair;
							}
							might_be_apparent_pair = false;
						}
					}
				}
				for (auto e : coface_entries) working_coboundary.push(e);
			}

			pivot = get_pivot(working_coboundary, modulus);

			if (get_index(pivot) != -1) {
				auto pair = pivot_column_index.find(get_index(pivot));

				if (pair != pivot_column_index.end()) {
					j = pair->second;
					column_to_add = columns_to_reduce[j];
					continue;
				}
			} else {
#ifdef PRINT_PERSISTENCE_PAIRS
#ifdef INDICATE_PROGRESS
				std::cout << "\033[K";
#endif
				std::cout << " [" << diameter << ", )" << std::endl << std::flush;
#endif
                births.push_back(diameter);
                deaths.push_back(-1);
				break;
			}

		found_persistence_pair:
		    value_t death = get_diameter(pivot);
#ifdef PRINT_PERSISTENCE_PAIRS
			if (diameter != death) {
#ifdef INDICATE_PROGRESS
				std::cout << "\033[K";
#endif
				std::cout << " [" << diameter << "," << death << ")" << std::endl << std::flush;
			}
#endif
            if (diameter != death) {
                births.push_back(diameter);
                deaths.push_back(death);
            }

			pivot_column_index.insert(std::make_pair(get_index(pivot), i));

#ifdef USE_COEFFICIENTS
			const coefficient_t inverse = multiplicative_inverse[get_coefficient(pivot)];
#endif

#ifdef ASSEMBLE_REDUCTION_MATRIX
			// replace current column of reduction_matrix (with a single diagonal 1 entry)
			// by reduction_column (possibly with a different entry on the diagonal)
			reduction_matrix.pop_back();
			while (true) {
				diameter_entry_t e = pop_pivot(reduction_column, modulus);
				index_t index = get_index(e);
				if (index == -1) break;
#ifdef USE_COEFFICIENTS
				const coefficient_t coefficient = inverse * get_coefficient(e) % modulus;
				assert(coefficient > 0);
#else
				const coefficient_t coefficient = 1;
#endif
				reduction_matrix.push_back(
				    make_diameter_entry(get_diameter(e), index, coefficient));
			}
#else
#ifdef USE_COEFFICIENTS
			reduction_coefficients.pop_back();
			reduction_coefficients.push_back(make_diameter_entry(column_to_reduce, inverse));
#endif
#endif
			break;
		} while (true);
	}

#ifdef INDICATE_PROGRESS
	std::cout << "\033[K";
#endif
}

bool is_prime(const coefficient_t n) {
	if (!(n & 1) || n < 2) return n == 2;
	for (coefficient_t p = 3, q = n / p, r = n % p; p <= q; p += 2, q = n / p, r = n % p)
		if (!r) return false;
	return true;
}

template <typename T> T read(std::ifstream& s) {
	T result;
	s.read(reinterpret_cast<char*>(&result), sizeof(T));
	return result; // on little endian: boost::endian::little_to_native(result);
}

void print_usage_and_exit(int exit_code) {
	std::cerr << "Usage: "
	          << "ripser "
	          << "[options] filename" << std::endl;
	std::cerr << std::endl;
	std::cerr << "Options:" << std::endl;
	std::cerr << std::endl;
	std::cerr << "  --help           print this screen" << std::endl;
	std::cerr << "  --dim <k>        compute persistent homology up to dimension <k>" << std::endl;
	std::cerr << "  --threshold <t>  compute Rips complexes up to diameter <t>" << std::endl;
#ifdef USE_COEFFICIENTS
	std::cerr << "  --modulus <p>    compute homology with coefficients in the prime field Z/<p>Z"
	          << std::endl;
#endif

	exit(exit_code);
}

void ripserJS(std::vector<value_t> distances, index_t n, value_t threshold, index_t dim_max, std::vector<std::vector<float>>& dgms) {
	if (threshold == -1) {
	    threshold = std::numeric_limits<value_t>::max();
    }

#ifdef USE_COEFFICIENTS
	coefficient_t modulus = 2;
#else
	const coefficient_t modulus = 2;
#endif

	compressed_lower_distance_matrix_adapter dist(distances);

	auto result = std::minmax_element(dist.distances.begin(), dist.distances.end());
	std::cout << "value range: [" << *result.first << "," << *result.second << "]" << std::endl;

	dim_max = std::min(dim_max, n - 2);

	binomial_coeff_table binomial_coeff(n, dim_max + 2);
	std::vector<coefficient_t> multiplicative_inverse(multiplicative_inverse_vector(modulus));

	std::vector<diameter_index_t> columns_to_reduce;
	for (index_t index = n; index-- > 0;) columns_to_reduce.push_back(diameter_index_t(0, index));

	for (index_t dim = 0; dim <= dim_max; ++dim) {
        std::vector<float> births;
        std::vector<float> deaths;
		rips_filtration_comparator<decltype(dist)> comp(dist, dim + 1, binomial_coeff);
		rips_filtration_comparator<decltype(dist)> comp_prev(dist, dim, binomial_coeff);

		hash_map<index_t, index_t> pivot_column_index;
		pivot_column_index.reserve(columns_to_reduce.size());

		compute_pairs(columns_to_reduce, pivot_column_index, dist, comp, comp_prev, dim, n,
		              threshold, modulus, multiplicative_inverse, binomial_coeff, births, deaths);
        dgms.push_back(births);
        dgms.push_back(deaths);

		if (dim < dim_max)
			assemble_columns_to_reduce(columns_to_reduce, pivot_column_index, comp, dim, n,
			                           threshold, binomial_coeff);
	}
}


EMSCRIPTEN_BINDINGS(stl_wrappers) {
    emscripten::register_vector<value_t>("VectorFloat");
    emscripten::register_vector<std::vector<float>>("VectorVectorFloat");
}

EMSCRIPTEN_BINDINGS(my_module) {
    function("ripserJS", &ripserJS);
}


/*int main(int argc, char** argv) {

	if (argc < 2) print_usage_and_exit(-1);

	const char* filename = nullptr;

	index_t dim_max = 1;
	value_t threshold = std::numeric_limits<value_t>::max();

#ifdef USE_COEFFICIENTS
	coefficient_t modulus = 2;
#else
	const coefficient_t modulus = 2;
#endif

	for (index_t i = 1; i < argc; ++i) {
		const std::string arg(argv[i]);
		if (arg == "--help") {
			print_usage_and_exit(0);
		} else if (arg == "--dim") {
			std::string parameter = std::string(argv[++i]);
			size_t next_pos;
			dim_max = std::stol(parameter, &next_pos);
			if (next_pos != parameter.size()) print_usage_and_exit(-1);
		} else if (arg == "--threshold") {
			std::string parameter = std::string(argv[++i]);
			size_t next_pos;
			threshold = std::stof(parameter, &next_pos);
			if (next_pos != parameter.size()) print_usage_and_exit(-1);
#ifdef USE_COEFFICIENTS
		} else if (arg == "--modulus") {
			std::string parameter = std::string(argv[++i]);
			size_t next_pos;
			modulus = std::stol(parameter, &next_pos);
			if (next_pos != parameter.size() || !is_prime(modulus)) print_usage_and_exit(-1);
#endif
		} else {
			if (filename) { print_usage_and_exit(-1); }
			filename = argv[i];
		}
	}

	std::ifstream input_stream(filename, std::ios_base::binary | std::ios_base::in);
	if (input_stream.fail()) {
		std::cerr << "couldn't open file " << filename << std::endl;
		exit(-1);
	}

	std::vector<value_t> diameters;

#ifdef FILE_FORMAT_DIPHA

	if (read<int64_t>(input_stream) != 8067171840) {
		std::cerr << filename << " is not a Dipha file (magic number: 8067171840)" << std::endl;
		exit(-1);
	}

	if (read<int64_t>(input_stream) != 7) {
		std::cerr << filename << " is not a Dipha distance matrix (file type: 7)" << std::endl;
		exit(-1);
	}

	index_t n = read<int64_t>(input_stream);

	distance_matrix dist_full;
	dist_full.distances = std::vector<std::vector<value_t>>(n, std::vector<value_t>(n));

	for (int i = 0; i < n; ++i)
		for (int j = 0; j < n; ++j) dist_full.distances[i][j] = read<double>(input_stream);
	std::cout << "distance matrix with " << n << " points" << std::endl;

	compressed_lower_distance_matrix_adapter dist(diameters, dist_full);
	std::cout << "distance matrix transformed to lower triangular form" << std::endl;
#endif

#ifdef FILE_FORMAT_UPPER_TRIANGULAR_CSV
	std::vector<value_t> distances;
	value_t value;
	while ((input_stream >> value).ignore()) distances.push_back(value);

	compressed_upper_distance_matrix_adapter dist_upper(distances);

	index_t n = dist_upper.size();
	std::cout << "distance matrix with " << n << " points" << std::endl;

	compressed_lower_distance_matrix_adapter dist(diameters, dist_upper);
	std::cout << "distance matrix transformed to lower triangular form" << std::endl;
#endif

#ifdef FILE_FORMAT_LOWER_TRIANGULAR_CSV
	std::vector<value_t>& distances = diameters;
	value_t value;
	while ((input_stream >> value).ignore()) distances.push_back(value);

	compressed_lower_distance_matrix_adapter dist(distances);

	index_t n = dist.size();

	std::cout << "distance matrix with " << n << " points" << std::endl;
#endif

	auto result = std::minmax_element(dist.distances.begin(), dist.distances.end());
	std::cout << "value range: [" << *result.first << "," << *result.second << "]" << std::endl;

	dim_max = std::min(dim_max, n - 2);

	binomial_coeff_table binomial_coeff(n, dim_max + 2);
	std::vector<coefficient_t> multiplicative_inverse(multiplicative_inverse_vector(modulus));

	std::vector<diameter_index_t> columns_to_reduce;
	for (index_t index = n; index-- > 0;) columns_to_reduce.push_back(diameter_index_t(0, index));

	for (index_t dim = 0; dim <= dim_max; ++dim) {

		rips_filtration_comparator<decltype(dist)> comp(dist, dim + 1, binomial_coeff);
		rips_filtration_comparator<decltype(dist)> comp_prev(dist, dim, binomial_coeff);

		hash_map<index_t, index_t> pivot_column_index;
		pivot_column_index.reserve(columns_to_reduce.size());

		compute_pairs(columns_to_reduce, pivot_column_index, dist, comp, comp_prev, dim, n,
		              threshold, modulus, multiplicative_inverse, binomial_coeff);

		if (dim < dim_max)
			assemble_columns_to_reduce(columns_to_reduce, pivot_column_index, comp, dim, n,
			                           threshold, binomial_coeff);
	}
}*/
